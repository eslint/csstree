const originalFetch = global.fetch;

global.fetch = (input, init) => {
    const url = input instanceof Request ? input.url : input;

    if (new URL(url).origin !== 'https://api.github.com') {
        return originalFetch(input, init);
    }

    const headers = new Headers(input instanceof Request ? input.headers : undefined);

    if (init?.headers) {
        new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    }

    headers.set('authorization', 'Bearer ' + process.env.GITHUB_TOKEN);

    return originalFetch(input, { ...init, headers });
};
