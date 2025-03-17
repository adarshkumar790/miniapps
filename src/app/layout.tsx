import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { Bounce, ToastContainer, toast } from 'react-toastify';


import { Root } from '@/components/Root/Root';
import { I18nProvider } from '@/core/i18n/provider';

import '@telegram-apps/telegram-ui/dist/styles.css';
import 'normalize.css/normalize.css';
import './_assets/globals.css';
import ContextProvider from '../../context';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Your Application Title Goes Here',
  description: 'Your application description goes here',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();

  const headersObj = headers();
  const cookies = headersObj.get('cookie')

  return (
    <html lang={locale}>
      <body>
        <ContextProvider cookies={cookies}>
          <I18nProvider>
            <Root>
              {children}

            </Root>
          </I18nProvider>
        </ContextProvider>
        <ToastContainer position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce} />
      </body>
    </html>
  );
}
