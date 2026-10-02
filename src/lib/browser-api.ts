import { createBrowserApi } from '@neon-adda/shared/web/client';
import { API_URL } from './env';

export const api = createBrowserApi('technician', API_URL);
