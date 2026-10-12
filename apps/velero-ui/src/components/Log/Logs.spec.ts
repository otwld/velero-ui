import { shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Logs from './Logs.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock('flowbite', () => ({ initTooltips: vi.fn() }));
vi.mock('@velero-ui-app/utils/date.utils', () => ({
  convertTimestampToDate: () => '',
}));

describe('raw logs', () => {
  it('renders HTML as text and highlights literal search terms safely', async () => {
    const raw =
      '<img src=x onerror=alert(1)> [a+b] & <script>alert(1)</script>';
    const wrapper = shallowMount(Logs, {
      props: { data: [{ raw, date: '', level: 'info', message: raw }] },
      global: { directives: { copyToClipboard: {}, download: {} } },
    });
    const rawButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('rawView'));
    expect(rawButton).toBeDefined();
    await rawButton?.trigger('click');
    expect(wrapper.find('tbody').text()).toBe(raw);
    expect(wrapper.find('tbody img').exists()).toBe(false);
    expect(wrapper.find('tbody script').exists()).toBe(false);

    await wrapper.get('input').setValue('[a+b]');
    expect(wrapper.get('mark').text()).toBe('[a+b]');
    expect(wrapper.find('tbody').text()).toBe(raw);
    await wrapper.get('input').setValue('<img');
    expect(wrapper.get('mark').text()).toBe('<img');
    expect(wrapper.find('tbody img').exists()).toBe(false);
    wrapper.unmount();
  });
});
