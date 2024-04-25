import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const appDirectory = path.join(process.cwd(), 'src', 'app')
  const mdxFilePaths = getAllMdxFilePaths(appDirectory)
  const priority = 0.5

  return mdxFilePaths
    .map((filePath) => {
      const pathname = path
        .relative(appDirectory, filePath)
        .replace(/\/page\.mdx$/, '')
      if (pathname === 'page.mdx') {
        return null
      }
      const isJobPage = pathname.startsWith('jobs');
      const url = isJobPage ? `https://e2b.dev/jobs/${pathname}` : `https://e2b.dev/docs/${pathname}`;
      const lastModified = fs.statSync(filePath).mtime
      const pagePriority = isJobPage ? 0.8 : priority;
      return {
        url,
        lastModified,
        priority: pagePriority,
      }
    })
    .filter(Boolean)
}

function getAllMdxFilePaths(directory: string): string[] {
  const fileNames = fs.readdirSync(directory)
  const filePaths = fileNames
    .map((fileName) => {
      const filePath = path.join(directory, fileName)
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        return getAllMdxFilePaths(filePath);
      } else if (path.basename(filePath) === 'page.mdx' || filePath.includes('/jobs/')) {
        return filePath;
      }
    })
    .filter(Boolean)

  return Array.prototype.concat(...filePaths)
}
