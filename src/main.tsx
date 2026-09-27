import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

import { store, persistor } from '@/store/store';
import { App } from './App';
import '@/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          locale={viVN}
          theme={{ token: { colorPrimary: '#1DBF73', borderRadius: 6, fontFamily: 'Inter, sans-serif' } }}
        >
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
