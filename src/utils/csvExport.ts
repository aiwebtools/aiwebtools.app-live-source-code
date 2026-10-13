import { Tool } from "@/types/tools";

/**
 * Escapes CSV fields that contain commas, quotes, or newlines
 */
const escapeCSVField = (field: string | undefined | null): string => {
  if (field === null || field === undefined) return '';
  
  // Convert to string and escape
  const str = String(field);
  
  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
};

/**
 * Converts tools array to comprehensive CSV format with ALL data needed to recreate the website
 */
export const convertToolsToCSV = (tools: Tool[]): string => {
  // Comprehensive CSV Headers - everything needed to recreate the website
  const headers = [
    'Index',
    'Tool Name',
    'Description',
    'Category',
    'Direct URL',
    'Video URL (YouTube)',
    'Image URL',
    'Emoji',
    'Color Gradient',
    'Tags',
    'Rating',
    'Total Votes',
    'Blockchain (if Web3)',
    'Is Free'
  ];

  // Create comprehensive CSV rows
  const rows = tools.map((tool, index) => [
    escapeCSVField((index + 1).toString()),
    escapeCSVField(tool.title),
    escapeCSVField(tool.description),
    escapeCSVField(tool.category),
    escapeCSVField(tool.directUrl),
    escapeCSVField(tool.videoUrl || ''),
    escapeCSVField(tool.imageUrl || ''),
    escapeCSVField(tool.emoji),
    escapeCSVField(tool.color),
    escapeCSVField(tool.tags?.join('; ') || ''),
    escapeCSVField(tool.rating?.toString() || '4.5'),
    escapeCSVField(tool.totalVotes?.toString() || '100'),
    escapeCSVField(tool.blockchain || ''),
    escapeCSVField(tool.isFree ? 'Yes' : (tool.tags?.some(t => t.toLowerCase().includes('free')) ? 'Yes' : 'No'))
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Triggers download of comprehensive CSV file with all tool data
 */
export const downloadToolsCSV = (tools: Tool[], filename?: string): void => {
  const date = new Date().toISOString().split('T')[0];
  const finalFilename = filename || `AIWebTools-Complete-Directory-${tools.length}-Tools-${date}.csv`;
  
  const csvContent = generateCSVWithMetadata(tools);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  
  console.log(`✅ CSV downloaded: ${finalFilename} with ${tools.length} tools`);
};

/**
 * Generates comprehensive CSV content with metadata header
 * Includes everything needed to recreate the AI Web Tools website
 */
export const generateCSVWithMetadata = (tools: Tool[]): string => {
  const now = new Date().toISOString();
  const categories = [...new Set(tools.map(t => t.category).filter(Boolean))];
  const toolsWithVideos = tools.filter(t => t.videoUrl).length;
  const toolsWithImages = tools.filter(t => t.imageUrl).length;
  const freeTools = tools.filter(t => t.isFree || t.tags?.some(tag => tag.toLowerCase().includes('free'))).length;
  
  const metadata = [
    `# ═══════════════════════════════════════════════════════════════════════════════`,
    `# AI WEB TOOLS - COMPLETE DIRECTORY EXPORT`,
    `# ═══════════════════════════════════════════════════════════════════════════════`,
    `# `,
    `# Generated: ${now}`,
    `# Total Tools: ${tools.length}`,
    `# Categories: ${categories.length}`,
    `# Tools with Video URLs: ${toolsWithVideos}`,
    `# Tools with Image URLs: ${toolsWithImages}`,
    `# Free Tools: ${freeTools}`,
    `# `,
    `# Website: https://aiwebtools.lovable.app/?via=aiwebtools`,
    `# Alternative: https://aiwebtools.app`,
    `# Contact: contact@ai-webtools.com`,
    `# Clone This Website (FREE): https://lovable.dev/projects/bad09a84-f9cd-4cda-9d42-9c4cfafc2867?utm_source=lovable-badge`,
    `# `,
    `# This CSV contains ALL data needed to recreate the AI Web Tools directory:`,
    `# - Tool names and descriptions`,
    `# - Direct URLs to each tool`,
    `# - YouTube video URLs for demos`,
    `# - Image URLs`,
    `# - Categories and tags for organization`,
    `# - Emoji icons and color schemes`,
    `# - Rating and vote data`,
    `# - Web3/blockchain identifiers`,
    `# `,
    `# ═══════════════════════════════════════════════════════════════════════════════`,
    ``
  ].join('\n');

  return metadata + convertToolsToCSV(tools);
};

/**
 * Get summary statistics for the tools database
 */
export const getToolsStatistics = (tools: Tool[]) => {
  const categories = [...new Set(tools.map(t => t.category).filter(Boolean))];
  const toolsWithVideos = tools.filter(t => t.videoUrl).length;
  const toolsWithImages = tools.filter(t => t.imageUrl).length;
  const freeTools = tools.filter(t => t.isFree || t.tags?.some(tag => tag.toLowerCase().includes('free'))).length;
  
  return {
    totalTools: tools.length,
    totalCategories: categories.length,
    toolsWithVideos,
    toolsWithImages,
    freeTools,
    categories
  };
};
