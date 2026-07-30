export const getLandingPages = () => {
  const pageFiles = import.meta.glob('/src/pages/*.tsx');
  const pages: string[] = [];
  let count = 0;
  for (const path in pageFiles) {
    const fileName = path.match(/\/([^/]+)\.tsx$/)?.[1];
    if (fileName && !fileName.includes('Detail') && fileName !== 'Admin') {
      pages.push(fileName);
      count++;
    }
  }
  return { pages, count };
};
