// frontend/src/services/analyticsService.js
// NEW FILE
import API from './api';

/**
 * Fetches aggregated chart + pie + summary data from the backend.
 * @param {'daily'|'weekly'|'monthly'} period
 */
export const fetchAnalyticsSummary = async (period = 'monthly') => {
  const response = await API.get(`/analytics/summary?period=${period}`);
  return response.data;
};

/**
 * Calls /analytics/export and triggers a PDF download in the browser.
 */
export const exportAnalyticsPDF = async () => {
  const response = await API.get('/analytics/export', {
    responseType: 'blob',
  });

  const url  = window.URL.createObjectURL(
    new Blob([response.data], { type: 'application/pdf' })
  );
  const link = document.createElement('a');
  link.href  = url;

  // Use filename from Content-Disposition if available
  const disposition = response.headers['content-disposition'];
  const match = disposition && disposition.match(/filename=(.+)/);
  link.setAttribute('download', match ? match[1] : 'budgetmate_report.pdf');

  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Fetches top 5 expense categories with percentage share (last 30 days).
 */
export const fetchTopCategories = async () => {
  const response = await API.get('/analytics/top-categories');
  return response.data;
};