import '../../globals.css';

export const metadata = {
  title: 'Admin Dashboard - Nazeefa Ahmed',
  description: 'Content management system for nazeefaahmed.com',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cream dark:bg-charcoal">
        {children}
      </body>
    </html>
  );
}