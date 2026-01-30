import app from './app.js';
import { config } from './config/env.js';

app.listen(config.PORT, () => {
    console.info(`Server running on port ${config.PORT}`);
});