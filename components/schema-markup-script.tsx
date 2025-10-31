
'use client';

import Script from 'next/script';

interface SchemaMarkupProps {
  schema: object | object[];
}

export function SchemaMarkupScript({ schema }: SchemaMarkupProps) {
  const schemaArray = Array.isArray(schema) ? schema : [schema];
  
  return (
    <>
      {schemaArray.map((item, index) => (
        <Script
          key={index}
          id={`schema-markup-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
