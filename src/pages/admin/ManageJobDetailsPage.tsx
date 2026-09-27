import { useEffect, useState } from 'react';
import { Table, Modal, Form, Input as AntInput, InputNumber, Select as AntSelect, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Pencil, Trash2 } from 'lucide-react';
import { jobTypeDetailService, jobTypeService } from '@/services/categories';
import { useAdminPaging } from '@/hooks/useAdminPaging';
import { getErrorMessage } from '@/utils/errors';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import type { JobTypeDetail, JobType } from '@/types/models';

export const ManageJobDetailsPage = () => {
  const paging = useAdminPaging<JobTypeDetail>({ fetcher: jobTypeDetailService.getPaged });
  const [types, setTypes] = useState<JobType[]>([]);
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; row?: JobTypeDetail } | null>(null);

  useEffect(() => {
    jobTypeService.getAll().then(setTypes).catch(() => setTypes([]));
  }, []);

  const remove = async (id: number) => {
    try {
      await jobTypeDetailService.remove(id);
      message.success('Đã xoá');
      paging.reload();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const typeName = (id: number) => types.find((t) => t.id === id)?.tenLoaiCongViec ?? id;

  const columns: ColumnsType<JobTypeDetail> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: 'Tên chi tiết loại', dataIndex: 'tenChiTiet' },
    {
      title: 'Thuộc loại',
      dataIndex: 'maLoaiCongViec',
      width: 200,
      render: (id: number) => typeName(id),
    },
    {
      title: 'Nhóm chi tiết',
      dataIndex: 'danhSachChiTiet',
      width: 130,
      render: (list: number[]) => `${list?.length ?? 0} nhóm`,
    },
    {
      title: 'Thao tác',
      width: 110,
      render: (_, r) => (
        <div className="flex gap-2">
          <button onClick={() => setModal({ mode: 'edit', row: r })} className="text-sky-600">
            <Pencil size={16} />
          </button>
          <Popconfirm title="Xoá?" onConfirm={() => remove(r.id)} okText="Xoá" cancelText="Huỷ">
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
      <AdminPageHeader
        searchPlaceholder="Tìm chi tiết loại..."
        onSearch={paging.search}
        onAdd={() => setModal({ mode: 'add' })}
        addLabel="Thêm chi tiết loại"
      />
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
      {modal && (
        <DetailModal
          mode={modal.mode}
          row={modal.row}
          types={types}
          onClose={() => setModal(null)}
          onDone={() => {
            setModal(null);
            paging.reload();
          }}
        />
      )}
    </div>
  );
};

const DetailModal = ({
  mode,
  row,
  types,
  onClose,
  onDone,
}: {
  mode: 'add' | 'edit';
  row?: JobTypeDetail;
  types: JobType[];
  onClose: () => void;
  onDone: () => void;
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const v = await form.validateFields();
    const body = {
      tenChiTiet: v.tenChiTiet,
      maLoaiCongViec: v.maLoaiCongViec,
      danhSachChiTiet: row?.danhSachChiTiet ?? [],
    };
    try {
      setSaving(true);
      if (mode === 'add') await jobTypeDetailService.create(body);
      else await jobTypeDetailService.update(row!.id, { id: row!.id, ...body });
      message.success('Thành công');
      onDone();
    } catch (err) {
      message.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={mode === 'add' ? 'Thêm chi tiết loại' : `Sửa #${row?.id}`}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={saving}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical" initialValues={row}>
        <Form.Item name="tenChiTiet" label="Tên chi tiết loại" rules={[{ required: true }]}>
          <AntInput />
        </Form.Item>
        <Form.Item name="maLoaiCongViec" label="Thuộc loại công việc" rules={[{ required: true }]}>
          {types.length ? (
            <AntSelect
              options={types.map((t) => ({ value: t.id, label: t.tenLoaiCongViec }))}
            />
          ) : (
            <InputNumber className="w-full" min={1} />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};
