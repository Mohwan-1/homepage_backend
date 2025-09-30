export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Company Info */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Company</h3>
          <div className="text-gray-600 space-y-2">
            <p>서울특별시 강남구 테헤란로 123</p>
            <p>전화: 02-1234-5678</p>
            <p>이메일: contact@company.com</p>
            <p>사업자등록번호: 123-45-67890</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}