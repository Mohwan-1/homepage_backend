interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { name: string; href: string }[];
}

export default function PageHeader({ title, subtitle, breadcrumb }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              {breadcrumb.map((item, index) => (
                <li key={item.href} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  <a href={item.href} className="hover:text-blue-600 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-600 max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}