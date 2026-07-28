// Just the line of record. The social and email links live in the contact
// section directly above, so repeating them here said nothing new.
export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="max-w-6xl mx-auto container-px py-8">
        <p className="meta">© {new Date().getFullYear()} Nazeefa Ahmed</p>
      </div>
    </footer>
  );
}
