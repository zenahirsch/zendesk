import https from 'https';
import { URL } from 'url';

require('babel-polyfill');

class Zendesk {
    constructor ({ 
        email = 'vimeostaff@vimeo.com', 
        token = '', 
        subdomain = 'vimeo'
    } = {}) {
        this.email = email;
        this.token = token;
        this.subdomain = subdomain;
    }

    request ({ 
        url, 
        path, 
        base = `https://${this.subdomain}.zendesk.com`, 
        method = 'GET', 
        data = '' 
    } = {}) {
        return new Promise((resolve, reject) => {
            const { protocol, hostname, pathname, search, port } = url ? new URL(url) : new URL(path, base);

            const options = {
                protocol,
                hostname,
                path: `${pathname}${search}`,
                port,
                method,
                auth: `${this.email}/token:${this.token}`,
                headers: { 'Accept': 'application/json' }
            };

            if (method === 'POST' || method === 'PUT') {
                options.headers['Content-Type'] = 'application/json';
            }

            const req = https.request(options, (res) => {
                const { statusCode } = res;
                let raw = '';

                if (statusCode !== 200) {
                    reject(new Error(`Request failed. Status code: ${statusCode}.`));
                    res.resume();
                    return;
                }

                res.setEncoding('utf8');
                res.on('data', (chunk) => raw += chunk);
                res.on('end', () => resolve(JSON.parse(raw)));
            });

            req.on('error', (e) => {
                reject(new Error(`Request failed: ${e.message}`));
            });

            req.write(JSON.stringify(data));
            req.end();
        });
    }

    async getTicket (ticket_id) {
        if (!ticket_id) {
            throw new Error('No ticket ID provided.');
        }

        const { ticket } = await this.request({ path: `/api/v2/tickets/${ticket_id}.json` });

        return ticket;
    }

    async getUserByID (user_id) {
        if (!user_id) {
            throw new Error('No user ID provided.');
        }

        const { user } = await this.request({ path: `/api/v2/users/${user_id}.json` });

        return user;
    }

    async search ({ query = '', per_page = 100 } = {}) {
        const q = encodeURIComponent(query);
        let results = [];

        let { results: page, next_page, count } = await this.request({ 
            path: `/api/v2/search.json?query=${q}&per_page=${per_page}` 
        });

        results = [...results, ...page];

        while (next_page) {
            ({ results: page, next_page } = await this.request({ url: next_page }));
            results = [...results, ...page];
        }

        return results;
    }
}

export default Zendesk;