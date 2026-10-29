import { describe, it, expect } from 'vitest';

import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import App from './App.vue';

describe('App', () => {
  it('renders the active route and updates it after navigation', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<h1>Backup overview</h1>' } },
        { path: '/settings', component: { template: '<h1>Settings</h1>' } },
      ],
    });
    await router.push('/');
    await router.isReady();

    const wrapper = mount(App, { global: { plugins: [router] } });
    try {
      expect(wrapper.get('h1').text()).toBe('Backup overview');

      await router.push('/settings');
      await flushPromises();

      expect(wrapper.get('h1').text()).toBe('Settings');
      expect(wrapper.text()).not.toContain('Backup overview');
    } finally {
      wrapper.unmount();
    }
  });
});
