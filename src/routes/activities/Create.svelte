<script>
  // 3rd Party
  import { getClient } from '@urql/svelte';
  import { Link, navigateTo } from 'yrv';
  import Typewriter from 'svelte-typewriter';
  import Icon from 'svelte-awesome';
  import { plus } from 'svelte-awesome/icons';

  // UI Support
  import StackedLayout from '../../elements/layouts/StackedLayout.svelte';
  import { ActionHeader } from '../../elements';
  import { Standard as StandardLink } from '../../elements/links';
  import Nav from '../../components/nav/interiorNav/Top.svelte';
  import ActivityForm from './components/form/ActivityForm.svelte';

  // data
  import sessionsApi from '../../dataSources/api.that.tech/sessions.js';

  // utilities
  import metaTagsStore from '../../store/metaTags';
  import { tagEvent } from '../../utilities/gtag';
  import logEvent from '../../utilities/eventTrack';
  import { formatCreate } from './lib/formatRequest';
  import { user } from '../../utilities/security.js';

  const { create } = sessionsApi(getClient());

  async function handleSubmit({
    detail: { values, setSubmitting, resetForm },
  }) {
    setSubmitting(true);

    const newActivity = formatCreate(values);
    const { id } = await create(newActivity, values.eventId);

    tagEvent('activity_created', 'activity', $user.sub);
    logEvent('activity_created');

    setSubmitting(false);
    navigateTo(`/activities/${id}?edit=true&isNew=true`, { replace: true });
  }

  metaTagsStore.set({
    title: 'New Activity - THAT',
    description:
      'Create a New [Activity, Code Review, Open Space, Chat], you get the idea.',
    openGraph: {
      type: 'website',
      url: `https://that.us/activities/create`,
    },
  });
</script>

<StackedLayout bodyBackgroundColor="bg-gray-100">
  <div slot="header">
    <Nav />
    <ActionHeader>
      <div class="flex space-x-2" slot="title">
        <span>Create a new</span>
        <div class="italic text-that-orange">
          <Typewriter loop cursor="white" interval="{[50, 60, 80]}">
            <span>Room.</span>
            <span>Presentation.</span>
            <span>Open Space.</span>
            <span>Code Review.</span>
            <span>Panel Discussion.</span>
            <span>Office Hours.</span>
            <span>Chat.</span>
            <span>Q&A.</span>
            <span>AMA.</span>
            <span>you decide.</span>
          </Typewriter>
        </div>
      </div>
    </ActionHeader>
  </div>

  <div slot="body">
    <div
      class="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <div class="flex items-center space-x-5">
        <div class="flex-shrink-0">
          <div class="relative text-that-blue">
            <Icon data="{plus}" class="rounded-full w-16 h-16" />
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create Activity</h1>
          <p class="text-sm font-medium text-gray-500">
            Below is a short set of questions to best schedule a new activity.
          </p>
        </div>
      </div>
      <div
        class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <StandardLink href="/my/submissions">
          View Your Past Submissions
        </StandardLink>
      </div>
    </div>

    <div class="mt-8 sm:px-6 max-w-3xl lg:max-w-7xl mx-auto">
      <ActivityForm handleSubmit="{handleSubmit}" />
    </div>
  </div>
</StackedLayout>
