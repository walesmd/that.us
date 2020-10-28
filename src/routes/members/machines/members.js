import { Machine, assign } from 'xstate';
import _ from 'lodash';
import pagingMachine from '../../../machines/paging';

import membersApi from '../../../dataSources/api.that.tech/members';

function createServices(client) {
  const { queryMembers, queryMembersNext } = membersApi(client);

  return {
    guards: {},

    services: {
      load: () => queryMembers(),
      loadNext: context => queryMembersNext(context.cursor),
    },

    actions: {
      logError: (context, event) => console.error({ context, event }),

      loadSuccess: assign({
        items: (context, { data }) => data.members,
        cursor: (context, { data }) => data.cursor,
        hasMore: (context, { data }) => true,
      }),

      // todo... we add to the object
      loadNextSuccess: assign({
        items: (context, event) =>
          _.uniqBy([...context.items, ...event.data.members], i => i.id),
        cursor: (context, { data }) => data.cursor,
      }),
    },
  };
}

function create(client) {
  const services = createServices(client);

  return Machine({ ...pagingMachine }, { ...services });
}

export default create;
