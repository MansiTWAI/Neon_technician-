import 'server-only';
import { createServerApi } from '@neon-adda/shared/web/server';
import { API_URL } from './env';

export const serverApi = createServerApi({ audience: 'technician', apiUrl: API_URL });
