import "../src/index.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import { initialize, mswLoader } from "msw-storybook-addon";

initialize({
  onUnhandledRequest: "bypass",
});

// Per https://storybook.js.org/docs/react/writing-stories/decorators#context-for-mocking
// Fresh client per story: avoids stale React Query errors and disables retries (each
// retry re-toasts from useBackend on failure).
export const decorators = [
  (Story, context) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const initialEntries = context.parameters?.router?.initialEntries ?? ["/"];
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <ToastContainer />
          <Story />
        </MemoryRouter>
      </QueryClientProvider>
    );
  },
];

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
};

export default preview;