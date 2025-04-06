export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <p className="text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} MetroWheel. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 