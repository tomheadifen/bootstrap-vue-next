import {enableAutoUnmount, mount} from '@vue/test-utils'
import {afterEach, describe, expect, it} from 'vitest'
import BCarousel from './BCarousel.vue'
import BCarouselSlide from './BCarouselSlide.vue'
import {h, nextTick} from 'vue'
// TODO test for newest changes
describe('carousel', () => {
  enableAutoUnmount(afterEach)

  it('has static class carousel', () => {
    const wrapper = mount(BCarousel)
    expect(wrapper.classes()).toContain('carousel')
  })

  it('has static class slide', () => {
    const wrapper = mount(BCarousel)
    expect(wrapper.classes()).toContain('slide')
  })

  it('tag is div', () => {
    const wrapper = mount(BCarousel)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('has attr id', () => {
    const wrapper = mount(BCarousel)
    expect(wrapper.attributes('id')).toBeDefined()
  })

  it('has attr id when prop id', () => {
    const wrapper = mount(BCarousel)
    expect(wrapper.attributes('id')).toBeDefined()
    expect(wrapper.attributes('id')).toContain('carousel')
  })

  it('has div with class carousel-inner', () => {
    const wrapper = mount(BCarousel)
    const $div = wrapper.find('.carousel-inner')
    expect($div.exists()).toBe(true)
  })

  it('element that has class carousel-inner is div', () => {
    const wrapper = mount(BCarousel)
    const $div = wrapper.get('.carousel-inner')
    expect($div.element.tagName).toBe('DIV')
  })

  it('does not have element with class carousel-indicators by default', () => {
    const wrapper = mount(BCarousel)
    const $div = wrapper.find('.carousel-indicators')
    expect($div.exists()).toBe(false)
  })

  it('has element with class carousel-indicators if prop indicator', () => {
    const wrapper = mount(BCarousel, {
      props: {indicators: true},
    })
    const $div = wrapper.find('.carousel-indicators')
    expect($div.exists()).toBe(true)
  })

  it('element with class carousel-indicators tag is div', () => {
    const wrapper = mount(BCarousel, {
      props: {indicators: true},
    })
    const $div = wrapper.get('.carousel-indicators')
    expect($div.element.tagName).toBe('DIV')
  })

  it('div with carousel-indicators class has no button child by default', () => {
    const wrapper = mount(BCarousel, {
      props: {indicators: true},
    })
    const $div = wrapper.get('.carousel-indicators')
    const $button = $div.find('button')
    expect($button.exists()).toBe(false)
  })

  it('does not have element with class carousel-control-prev by default', () => {
    const wrapper = mount(BCarousel)
    const $button = wrapper.find('.carousel-control-prev')
    expect($button.exists()).toBe(false)
  })

  it('has element with class carousel-control-prev when prop controls', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.find('.carousel-control-prev')
    expect($button.exists()).toBe(true)
  })

  it('element with class carousel-control-prev is tag button', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-prev')
    expect($button.element.tagName).toBe('BUTTON')
  })

  it('button with class carousel-control-prev has static attr as button', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-prev')
    expect($button.attributes('type')).toBe('button')
  })

  it('button with class carousel-control-prev has child element with class carousel-control-prev-icon', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-prev')
    const $span = $button.find('.carousel-control-prev-icon')
    expect($span.exists()).toBe(true)
  })

  it('element with class carousel-control-prev-icon is tag span', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-prev')
    const $span = $button.get('.carousel-control-prev-icon')
    expect($span.element.tagName).toBe('SPAN')
  })

  it('element with class carousel-control-prev-icon has static attr aria-hidden to be true', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-prev')
    const $span = $button.get('.carousel-control-prev-icon')
    expect($span.attributes('aria-hidden')).toBe('true')
  })

  it('button with class carousel-control-prev has child element with class visually-hidden', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-prev')
    const $span = $button.find('.visually-hidden')
    expect($span.exists()).toBe(true)
  })

  it('button whos class is carousel-control-prev child element with class visually-hidden has is tag span', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-prev')
    const $span = $button.get('.visually-hidden')
    expect($span.element.tagName).toBe('SPAN')
  })

  it('button whos class is carousel-control-prev child element with class visually-hidden has text is prop controlsPrevText', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true, controlsPrevText: 'foobar'},
    })
    const $button = wrapper.get('.carousel-control-prev')
    const $span = $button.get('.visually-hidden')
    expect($span.text()).toBe('foobar')
  })

  it('button whos class is carousel-control-prev child element with class visually-hidden has text previous by default', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-prev')
    const $span = $button.get('.visually-hidden')
    expect($span.text()).toBe('Previous')
  })

  it('does not have element with class carousel-control-next by default', () => {
    const wrapper = mount(BCarousel)
    const $button = wrapper.find('.carousel-control-next')
    expect($button.exists()).toBe(false)
  })

  it('has element with class carousel-control-next when prop controls', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.find('.carousel-control-next')
    expect($button.exists()).toBe(true)
  })

  it('element with class carousel-control-next is tag button', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-next')
    expect($button.element.tagName).toBe('BUTTON')
  })

  it('button with class carousel-control-next has static attr as button', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-next')
    expect($button.attributes('type')).toBe('button')
  })

  it('button with class carousel-control-next has child element with class carousel-control-next-icon', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-next')
    const $span = $button.find('.carousel-control-next-icon')
    expect($span.exists()).toBe(true)
  })

  it('button whos class is carousel-control-next child element with class carousel-control-next-icon is tag span', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-next')
    const $span = $button.get('.carousel-control-next-icon')
    expect($span.element.tagName).toBe('SPAN')
  })

  it('element with class carousel-control-next-icon has static attr aria-hidden to be true', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-next')
    const $span = $button.get('.carousel-control-next-icon')
    expect($span.attributes('aria-hidden')).toBe('true')
  })

  it('button with class carousel-control-next has child element with class visually-hidden', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-next')
    const $span = $button.find('.visually-hidden')
    expect($span.exists()).toBe(true)
  })

  it('button whos class is carousel-control-next has child element with class visually-hidden is tag span', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-next')
    const $span = $button.get('.visually-hidden')
    expect($span.element.tagName).toBe('SPAN')
  })

  it('button whos class is carousel-control-next child element with class visually-hidden has text is prop controlsNextText', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true, controlsNextText: 'foobar'},
    })
    const $button = wrapper.get('.carousel-control-next')
    const $span = $button.get('.visually-hidden')
    expect($span.text()).toBe('foobar')
  })

  it('buttons whos class is carousel-control-next child element with class visually-hidden has text previous by default', () => {
    const wrapper = mount(BCarousel, {
      props: {controls: true},
    })
    const $button = wrapper.get('.carousel-control-next')
    const $span = $button.get('.visually-hidden')
    expect($span.text()).toBe('Next')
  })

  describe('aria', () => {
    it('gives aria-label on the carousel-indicators with prop labelIndicators', async () => {
      const wrapper = mount(BCarousel, {
        props: {indicators: true},
        slots: {default: () => h(BCarouselSlide)},
      })

      const div = wrapper.get('.carousel-indicators')
      expect(div.attributes('aria-label')).toBe('Select a slide to display')
      await wrapper.setProps({labelIndicators: 'foobar'})
      expect(div.attributes('aria-label')).toBe('foobar')
    })
    it('gives aria-owns on the carousel-indicators with the id of the carousel', async () => {
      const wrapper = mount(BCarousel, {
        props: {indicators: true},
        slots: {default: () => [h(BCarouselSlide), h(BCarouselSlide)]},
      })
      const div = wrapper.get('.carousel-indicators')
      const ariaOwnership = div.attributes('aria-owns')
      expect(ariaOwnership).toContain('carousel-button-ownership')
      const buttons = div.findAll('button')
      for (const button of buttons) {
        expect(button.attributes('aria-controls')).toBe(ariaOwnership)
      }
    })
    it('button contains aria-described by of the carousel-item', async () => {
      const wrapper = mount(BCarousel, {
        props: {indicators: true},
        slots: {default: () => [h(BCarouselSlide), h(BCarouselSlide, {id: 'foobar!!!'})]},
      })
      const div = wrapper.get('.carousel-indicators')
      const [first, second] = div.findAll('button')
      await nextTick()
      expect(first.attributes('aria-describedby')).toBeDefined()
      expect(first.attributes('aria-describedby')).toContain('__carousel-slide___')
      expect(second.attributes('aria-describedby')).toBe('foobar!!!')
    })
  })
})
