import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
    title: 'pages/UCSBOrganization/UCSBOrganizationCreatePage',
    component: UCSBOrganizationCreatePage
};

const Template = () => <UCSBOrganizationCreatePage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        http.get('/api/currentUser', () => {
            return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
                status: 200,
            });
        }),
        http.get('/api/systemInfo', () => {
            return HttpResponse.json(systemInfoFixtures.showingNeither, {
                status: 200,
            });
        }),
        http.post('/api/ucsborganization/post', () => {
            window.alert("POST: /api/ucsborganization/post");
            return HttpResponse.json({}, {
                status: 200,
            });
        }),
    ]
}