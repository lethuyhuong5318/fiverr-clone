import { Table, Tag, Popconfirm, message, Button as AntButton } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { hiresService } from '@/services/hires';
import { useAdminPaging } from '@/hooks/useAdminPaging';
import { getErrorMessage } from '@/utils/errors';
import { formatDateTime } from '@/utils/formatters';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import type { Hire } from '@/types/models';

export const ManageHiresPage = () => {
  const paging = useAdminPaging<Hire>({ fetcher: hiresService.getPaged });

  const remove = async (id: number) => {
    try {
      await hiresService.remove(id);
      message.success('Đã xoá');
      paging.reload();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const complete = async (id: number) => {
    try {
      await hiresService.complete(id);
      message.success('Đã đánh dấu hoàn thành');
      paging.reload();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const columns: ColumnsType<Hire> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: 'Mã công việc', dataIndex: 'maCongViec', width: 120 },
    { title: 'Người thuê', dataIndex: 'maNguoiThue', width: 120 },
    {
      title: 'Ngày thuê',
      dataIndex: 'ngayThue',
      render: (v: string) => formatDateTime(v),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'hoanThanh',
      width: 130,
      render: (v: boolean) =>
        v ? <Tag color="green">Hoàn thành</Tag> : <Tag color="orange">Đang thực hiện</Tag>,
    },
    {
      title: 'Thao tác',
      width: 150,
      render: (_, r) => (
        <div className="flex items-center gap-2">
          {!r.hoanThanh && (
            <AntButton
              size="small"
              type="link"
              icon={<CheckCircle2 size={15} />}
              onClick={() => complete(r.id)}
            >
              Hoàn thành
            </AntButton>
          )}
          <Popconfirm title="Xoá đơn thuê này?" onConfirm={() => remove(r.id)} okText="Xoá" cancelText="Huỷ">
            <button className="text-red-500">
              <Trash2 size={16} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader searchPlaceholder="Tìm theo mã..." onSearch={paging.search} />
      {paging.error && <p className="mb-3 text-sm text-red-500">{paging.error}</p>}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={paging.rows}
        loading={paging.loading}
        pagination={{
          current: paging.page,
          pageSize: paging.pageSize,
          total: paging.total,
          onChange: paging.changePage,
          showSizeChanger: false,
        }}
        scroll={{ x: 760 }}
      />
    </div>
  );
};
