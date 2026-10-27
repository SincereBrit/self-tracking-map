import './globals.css';

export const metadata = {
  title: 'RouteTracker',
  description: 'Self tracking website with live GPS route monitoring and history.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
