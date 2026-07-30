import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  if (!items || items.length === 0) return null;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${window.location.origin}${item.url.startsWith('/') ? item.url : `/${item.url}`}` : window.location.href,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className={`flex items-center flex-wrap gap-2 text-sm ${className}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <React.Fragment key={index}>
              {isLast || !item.url ? (
                <span className="font-medium truncate max-w-xs sm:max-w-md text-amber-500 dark:text-amber-400" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link to={item.url} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-gray-500 dark:text-gray-400">
                  {item.name}
                </Link>
              )}
              
              {!isLast && (
                <span className="text-gray-400 dark:text-gray-500 mx-1">
                  {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
};

