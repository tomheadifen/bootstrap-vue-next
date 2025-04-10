import {enableAutoUnmount, mount} from '@vue/test-utils'
import {afterEach, describe, expect, it, vi} from 'vitest'
import BTable from './BTable.vue'
import type {BTableSortBy, TableField, TableItem} from '../../types'
import {nextTick} from 'vue'

interface SimplePerson {
  first_name: string
  age: number
}

const simpleItems: TableItem<SimplePerson>[] = [
  {age: 27, first_name: 'Havij'},
  {age: 9, first_name: 'Cyndi'},
  {age: 42, first_name: 'Robert'},
]

const multiSort: TableItem<SimplePerson>[] = [
  {age: 27, first_name: 'Havij'},
  {age: 9, first_name: 'Cyndi'},
  {age: 42, first_name: 'Robert'},
  {age: 35, first_name: 'Robert'},
  {age: 101, first_name: 'Cyndi'},
]

const simpleFields: Exclude<TableField<SimplePerson>, string>[] = [
  {key: 'first_name', label: 'First Name', sortable: true},
  {key: 'age', label: 'Age', sortable: true},
]

const formattedFields: Exclude<TableField<SimplePerson>, string>[] = [
  {
    key: 'is_adult',
    label: 'Adult?',
    sortable: true,
    sortByFormatted: true,
    formatter: (_value: unknown, _key?: unknown, item?: SimplePerson) =>
      item ? (item.age >= 18 ? 'Yes' : 'No') : 'Something went wrong',
  },
  {key: 'first_name', label: 'First Name', sortable: true},
  {key: 'age', label: 'Age', sortable: true},
]

class Person {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public age: number
  ) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
  }
}

const nestableItemsTest = {
  items: [
    {yoo1: 123, yoo2: 321},
    {yoo1: 789, yoo2: 987},
  ] satisfies TableItem[],
  fields: [
    {key: 'yoo1', label: 'YOO1'},
    {key: 'yoo2', label: 'YOO2'},
  ] satisfies TableField[],
}

enableAutoUnmount(afterEach)

describe('structure', () => {
  describe('tbody', () => {
    it('has table class by default', () => {
      const wrapper = mount(BTable, {
        props: {items: simpleItems},
      })
      expect(wrapper.get('table').classes()).toContain('table')
    })

    it('has b-table class by default', () => {
      const wrapper = mount(BTable, {
        props: {items: simpleItems},
      })
      expect(wrapper.get('table').classes()).toContain('b-table')
    })

    it('creates #columns === #fields', () => {
      const wrapper = mount(BTable, {
        props: {items: simpleItems, fields: formattedFields},
      })
      const heads = wrapper.get('table').findAll('th')
      expect(heads.length).toBe(3)
    })

    it('uses label from fields', () => {
      const wrapper = mount(BTable, {
        props: {items: simpleItems, fields: simpleFields},
      })
      const heads = wrapper.get('table').findAll('th')
      expect(heads[0].text()).toBe('First Name')
      expect(heads[1].text()).toBe('Age')
    })

    it('shows sortable columns when sortable === true', () => {
      const wrapper = mount(BTable, {
        props: {items: simpleItems, fields: simpleFields},
      })
      const heads = wrapper.get('table').findAll('th')
      expect(heads[0].classes()).toContain('b-table-sortable-column')
      expect(heads[1].classes()).toContain('b-table-sortable-column')
    })
  })

  describe('dynamic slots', () => {
    it('foot()', () => {
      const wrapper = mount(BTable, {
        props: {
          fields: [{key: 'name'}, {key: 'count'}],
          items: [
            {
              name: 'John Smith',
              count: 3,
            },
          ],
          responsive: true,
          showEmpty: true,
          bordered: true,
          footClone: true,
        },
        slots: {
          'foot(name)': 'total',
          'foot()': 'a lot',
        },
      })
      const tfoot = wrapper.get('tfoot')
      expect(tfoot.text()).toBe('totala lot')
    })
    it('head()', () => {
      const wrapper = mount(BTable, {
        props: {
          fields: [{key: 'name'}, {key: 'count'}],
          items: [
            {
              name: 'John Smith',
              count: 3,
            },
          ],
          responsive: true,
          showEmpty: true,
          bordered: true,
          footClone: true,
        },
        slots: {
          'head(name)': 'total',
          'head()': 'a lot',
        },
      })
      const thead = wrapper.get('thead')
      expect(thead.text()).toBe('totala lot')
    })
    it('cell()', () => {
      const wrapper = mount(BTable, {
        props: {
          fields: [{key: 'name'}, {key: 'count'}],
          items: [
            {
              name: 'John Smith',
              count: 3,
            },
          ],
          responsive: true,
          showEmpty: true,
          bordered: true,
          footClone: true,
        },
        slots: {
          'cell(name)': 'total',
          'cell()': 'a lot',
        },
      })
      const tbody = wrapper.get('tbody')
      expect(tbody.text()).toBe('totala lot')
    })
  })
})

describe('single-sort', () => {
  it('does not show sortable columns when sortable undefined', () => {
    const wrapper = mount(BTable, {
      props: {items: simpleItems},
    })
    const heads = wrapper.get('table').findAll('th')
    expect(heads[0].classes()).not.toContain('b-table-sortable-column')
    expect(heads[1].classes()).not.toContain('b-table-sortable-column')
  })

  it('has aria-sort="none" by default', () => {
    const wrapper = mount(BTable, {
      props: {items: simpleItems, fields: simpleFields},
    })
    const heads = wrapper.get('table').findAll('th')
    expect(heads[0].attributes('aria-sort')).toBe('none')
  })

  it('has aria-sort="ascending" on first click', async () => {
    const wrapper = mount(BTable, {
      props: {items: simpleItems, fields: simpleFields},
    })
    const [names] = wrapper.get('table').findAll('th')
    await names.trigger('click')
    expect(names.attributes('aria-sort')).toBe('ascending')
  })

  it('has aria-sort="descending" on second click', async () => {
    const wrapper = mount(BTable, {
      props: {items: simpleItems, fields: simpleFields},
    })
    const [names] = wrapper.get('table').findAll('th')
    await names.trigger('click')
    await names.trigger('click')
    expect(names.attributes('aria-sort')).toBe('descending')
  })

  it('sorts text ascending', () => {
    const wrapper = mount(BTable, {
      props: {
        items: simpleItems,
        fields: simpleFields,
        sortBy: [{order: 'asc', key: 'first_name'}],
      },
    })
    const text = wrapper
      .get('tbody')
      .findAll('tr')
      .map((row) => row.find('td').text())
    expect(text).toStrictEqual(['Cyndi', 'Havij', 'Robert'])
  })

  it('sorts text descending', () => {
    const wrapper = mount(BTable, {
      props: {
        items: simpleItems,
        fields: simpleFields,
        sortBy: [{order: 'desc', key: 'first_name'}],
      },
    })
    const text = wrapper
      .get('tbody')
      .findAll('tr')
      .map((row) => row.find('td').text())
    expect(text).toStrictEqual(['Robert', 'Havij', 'Cyndi'])
  })

  it('sorts numbers ascending', () => {
    const wrapper = mount(BTable, {
      props: {items: simpleItems, fields: simpleFields, sortBy: [{order: 'asc', key: 'age'}]},
    })
    const text = wrapper
      .get('tbody')
      .findAll('tr')
      .map((row) => row.findAll('td')[1].text())
    expect(text).toStrictEqual(['9', '27', '42'])
  })

  it('sorts numbers descending', () => {
    const wrapper = mount(BTable, {
      props: {
        items: simpleItems,
        fields: simpleFields,
        sortBy: [{order: 'desc', key: 'age'}],
      },
    })
    const text = wrapper
      .get('tbody')
      .findAll('tr')
      .map((row) => row.findAll('td')[1].text())
    expect(text).toStrictEqual(['42', '27', '9'])
  })

  it('sorts by formatted when sortByFormatted === true && formatter exists', () => {
    const wrapper = mount(BTable, {
      props: {
        items: simpleItems,
        fields: formattedFields,
        sortBy: [{order: 'asc', key: 'is_adult'}],
      },
    })
    const text = wrapper
      .get('tbody')
      .findAll('tr')
      .map((row) => row.find('td').text())
    expect(text).toStrictEqual(['No', 'Yes', 'Yes'])
  })

  it('sorts by formatted when sortByFormatted === true && formatter exists and respects sorDesc', () => {
    const wrapper = mount(BTable, {
      props: {
        items: simpleItems,
        fields: formattedFields,
        sortBy: [{order: 'desc', key: 'is_adult'}],
      },
    })
    const text = wrapper
      .get('tbody')
      .findAll('tr')
      .map((row) => row.find('td').text())
    expect(text).toStrictEqual(['Yes', 'Yes', 'No'])
  })

  it('sorts by custom formatter when sortByFormatted === function', () => {
    const customFormatterFields: Exclude<TableField<SimplePerson>, string>[] = [
      {
        key: 'first_name',
        label: 'First Name',
        sortable: true,
        sortByFormatted: (value: unknown) => (value as string).slice(1),
      },
      {key: 'age', label: 'Age', sortable: true},
    ]

    const wrapper = mount(BTable, {
      props: {
        items: simpleItems,
        fields: customFormatterFields,
        sortBy: [{order: 'asc', key: 'first_name'}],
      },
    })
    const text = wrapper
      .get('tbody')
      .findAll('tr')
      .map((row) => row.find('td').text())
    expect(text).toStrictEqual(['Havij', 'Robert', 'Cyndi'])
  })
})

describe('multi-sort', () => {
  it('has aria-sort labels reflecting sortBy prop', () => {
    const wrapper = mount(BTable, {
      props: {
        multisort: true,
        items: multiSort,
        fields: simpleFields,
        sortBy: [
          {key: 'age', order: 'asc'},
          {key: 'first_name', order: 'desc'},
        ],
      },
    })
    const heads = wrapper.get('table').findAll('th')
    expect(heads[0].attributes('aria-sort')).toBe('descending')
    expect(heads[1].attributes('aria-sort')).toBe('ascending')
  })

  it('correctly sorts on two columns', () => {
    const wrapper = mount(BTable, {
      props: {
        multisort: true,
        items: multiSort,
        fields: simpleFields,
        sortBy: [
          {key: 'first_name', order: 'desc'},
          {key: 'age', order: 'asc'},
        ],
      },
    })
    const text = wrapper
      .get('tbody')
      .findAll('tr')
      .map((row) => row.findAll('td')[1].text())
    expect(text).toStrictEqual(['35', '42', '27', '9', '101'])
  })
})

it('will display data when using a inferred nested object [item: { "yoo.1": 123, "yoo.2": 321 }]', () => {
  const wrapper = mount(BTable, {
    props: nestableItemsTest,
  })
  const text = wrapper
    .get('tbody')
    .findAll('tr')
    .map((row) => row.findAll('td').map((td) => td.text()))
  expect(text).toStrictEqual([
    ['123', '321'],
    ['789', '987'],
  ])
})

describe('object-persistence', () => {
  it('Passes the original object for scoped cell slot item', () => {
    const items = [new Person(1, 'John', 'Doe', 30), new Person(2, 'Jane', 'Smith', 25)]
    const wrapper = mount(BTable, {
      props: {
        primaryKey: 'id',
        items,
      },
      slots: {
        'cell()': `<template #cell()="row">{{ row.item.constructor.name }}</template>`,
      },
    })
    const $tbody = wrapper.get('tbody')
    const $tr = $tbody.findAll('tr')
    $tr.forEach((el) => {
      const $tds = el.findAll('td')
      expect($tds.length).toBe(4)
      $tds.forEach(($td) => {
        expect($td.text()).toBe('Person')
      })
    })
  })

  describe('selectedItems system', () => {
    it('gives the correct row a class when selected', async () => {
      const items = [new Person(1, 'John', 'Doe', 30), new Person(2, 'Jane', 'Smith', 25)]

      const wrapper = mount(BTable, {
        props: {
          'selectMode': 'multi' as const,
          'selectable': true,
          items,
          'selectedItems': [],
          'onUpdate:selectedItems': (value) => wrapper.setProps({selectedItems: value}),
        },
      })
      const $trs = wrapper.findAll('tr')
      await $trs[1].trigger('click')
      await $trs[2].trigger('click')
      expect($trs[1].classes()).toContain('selected')
      expect($trs[2].classes()).toContain('selected')
      await $trs[1].trigger('click')
      await $trs[2].trigger('click')
      expect($trs[1].classes()).not.toContain('selected')
      expect($trs[2].classes()).not.toContain('selected')
    })

    it('single mode', async () => {
      const items = [new Person(1, 'John', 'Doe', 30), new Person(2, 'Jane', 'Smith', 25)]

      const wrapper = mount(BTable, {
        props: {
          'selectMode': 'single' as const,
          'selectable': true,
          items,
          'selectedItems': [],
          'onUpdate:selectedItems': (value) => wrapper.setProps({selectedItems: value}),
        },
      })
      const $trs = wrapper.findAll('tr')
      await $trs[1].trigger('click')
      expect($trs[1].classes()).toContain('selected')
      await nextTick()
      await $trs[2].trigger('click')
      expect($trs[1].classes()).not.toContain('selected')
      expect($trs[2].classes()).toContain('selected')
    })

    it('multi mode', async () => {
      const items = [new Person(1, 'John', 'Doe', 30), new Person(2, 'Jane', 'Smith', 25)]
      const wrapper = mount(BTable, {
        props: {
          'selectMode': 'multi' as const,
          'selectable': true,
          items,
          'selectedItems': [],
          'onUpdate:selectedItems': (value) => wrapper.setProps({selectedItems: value}),
        },
      })
      const $trs = wrapper.findAll('tr')
      await $trs[1].trigger('click')
      await $trs[2].trigger('click')
      expect($trs[1].classes()).toContain('selected')
      expect($trs[2].classes()).toContain('selected')
    })

    describe('ranged mode', () => {
      it('no modifiers', async () => {
        const items = [
          new Person(1, 'John', 'Doe', 30),
          new Person(2, 'Jane', 'Smith', 25),
          new Person(3, 'John', 'Doe', 30),
          new Person(4, 'Jane', 'Smith', 25),
        ]

        const wrapper = mount(BTable, {
          props: {
            'selectMode': 'single' as const,
            'selectable': true,
            items,
            'selectedItems': [],
            'onUpdate:selectedItems': (value) => wrapper.setProps({selectedItems: value}),
          },
        })
        const $trs = wrapper.findAll('tr')
        await $trs[1].trigger('click')
        expect($trs[1].classes()).toContain('selected')
        await nextTick()
        await $trs[2].trigger('click')
        expect($trs[1].classes()).not.toContain('selected')
        expect($trs[2].classes()).toContain('selected')
      })
      it('ctrl click', async () => {
        const items = [
          new Person(1, 'John', 'Doe', 30),
          new Person(2, 'Jane', 'Smith', 25),
          new Person(3, 'John', 'Doe', 30),
          new Person(4, 'Jane', 'Smith', 25),
        ]

        const wrapper = mount(BTable, {
          props: {
            'selectMode': 'range' as const,
            'selectable': true,
            items,
            'selectedItems': [],
            'onUpdate:selectedItems': (value) => wrapper.setProps({selectedItems: value}),
          },
        })
        const $trs = wrapper.findAll('tr')
        await $trs[1].trigger('click')
        expect($trs[1].classes()).toContain('selected')
        const event = new MouseEvent('click', {ctrlKey: true})
        $trs[3].element.dispatchEvent(event)
        await nextTick()
        expect($trs[1].classes()).toContain('selected')
        expect($trs[3].classes()).toContain('selected')
      })
      it('shift click', async () => {
        const items = [
          new Person(1, 'John', 'Doe', 30),
          new Person(2, 'Jane', 'Smith', 25),
          new Person(3, 'John', 'Doe', 30),
          new Person(4, 'Jane', 'Smith', 25),
        ]

        const wrapper = mount(BTable, {
          props: {
            'selectMode': 'range' as const,
            'selectable': true,
            items,
            'selectedItems': [],
            'onUpdate:selectedItems': (value) => wrapper.setProps({selectedItems: value}),
          },
        })
        const $trs = wrapper.findAll('tr')
        await $trs[1].trigger('click')
        expect($trs[1].classes()).toContain('selected')
        const event = new MouseEvent('click', {shiftKey: true})
        $trs[3].element.dispatchEvent(event)
        await nextTick()
        expect($trs[1].classes()).toContain('selected')
        expect($trs[2].classes()).toContain('selected')
        expect($trs[3].classes()).toContain('selected')
      })
      it('shift click correct order', async () => {
        const wrapper = mount(BTable, {
          props: {
            'selectMode': 'range' as const,
            'selectable': true,
            'items': [
              {id: 1, text: 'C'},
              {id: 2, text: 'A'},
              {id: 3, text: 'B'},
              {id: 4, text: 'D'},
            ],
            'fields': [
              {key: 'id', sortable: true},
              {key: 'text', sortable: true},
            ],
            'selectedItems': [],
            'onUpdate:selectedItems': (value) => wrapper.setProps({selectedItems: value}),
            'sortBy': [{key: 'text', order: 'asc'}] as BTableSortBy[],
            'primaryKey': 'id',
          },
        })
        const [first, second, third, fourth] = wrapper.findAll('tr')
        await fourth.trigger('click')
        const event = new MouseEvent('click', {shiftKey: true})
        third.element.dispatchEvent(event)
        await nextTick()
        expect(first.classes()).not.toContain('selected')
        expect(second.classes()).not.toContain('selected')
        expect(third.classes()).toContain('selected')
        expect(fourth.classes()).toContain('selected')
      })
    })

    it('classes are applied correctly when using prop responsive and busy simultaneously', () => {
      const wrapper = mount(BTable, {
        props: {
          items: simpleItems,
          fields: simpleFields,
          responsive: true,
          busy: true,
        },
      })
      const $table = wrapper.get('table')
      expect($table.classes()).toContain('b-table-busy')
      expect($table.attributes('ariabusy')).toBe('true')
    })

    it('sorting does not wipe out the comparer function', async () => {
      const sortFields = [
        {key: 'last_name', sortable: true},
        {key: 'first_name', sortable: true},
        {key: 'marks', sortable: true},
      ]

      const sortItems = [
        {marks: -40, first_name: 'Dickerson', last_name: 'Macdonald'},
        {marks: -45, first_name: 'Zelda', last_name: 'Macdonald'},
        {marks: 21, first_name: 'Larsen', last_name: 'Shaw'},
        {marks: 89, first_name: 'Geneva', last_name: 'Wilson'},
        {marks: 89, first_name: 'Gary', last_name: 'Wilson'},
        {marks: 38, first_name: 'Jami', last_name: 'Carney'},
      ]

      const spyFn = vi.fn()

      const wrapper = mount(BTable, {
        props: {
          items: sortItems,
          fields: sortFields,
          sortBy: [
            {
              key: 'marks',
              order: 'asc',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              comparer: (a: any, b: any) => {
                spyFn()
                return a.marks.toString().localeCompare(b.marks.toString())
              },
            },
            {
              key: 'last_name',
              order: 'asc',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              comparer: (a: any, b: any) => {
                spyFn()
                return a.last_name.localeCompare(b.last_name)
              },
            },
            {
              key: 'first_name',
              order: 'asc',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              comparer: (a: any, b: any) => {
                spyFn()
                return a.first_name.localeCompare(b.first_name)
              },
            },
          ],
        },
      })

      // This test seems brittle
      expect(spyFn).toHaveBeenCalledTimes(13)
      const [lastname, firstname, marks] = wrapper.get('thead').findAll('th')
      await lastname.trigger('click')
      await lastname.trigger('click')
      await lastname.trigger('click')
      expect(spyFn).toHaveBeenCalledTimes(32)
      await firstname.trigger('click')
      await firstname.trigger('click')
      await firstname.trigger('click')
      expect(spyFn).toHaveBeenCalledTimes(54)
      await marks.trigger('click')
      await marks.trigger('click')
      await marks.trigger('click')
      expect(spyFn).toHaveBeenCalledTimes(71)
      await lastname.trigger('click')
      await lastname.trigger('click')
      await lastname.trigger('click')
      expect(spyFn).toHaveBeenCalledTimes(90)
      await firstname.trigger('click')
      await firstname.trigger('click')
      await firstname.trigger('click')
      expect(spyFn).toHaveBeenCalledTimes(112)
      await marks.trigger('click')
      await marks.trigger('click')
      await marks.trigger('click')
      expect(spyFn).toHaveBeenCalledTimes(129)
    })
  })

  describe('stacked mode', () => {
    it('stacked mode renders the correct label', () => {
      const fields = [
        {
          key: 'id',
          label: 'The ID',
        },
        {
          key: 'first_name',
          label: 'this is the first name',
        },
        {
          key: 'last_name',
          label: 'this is the last name',
        },
      ]
      const items = [
        {
          id: 1,
          first_name: 'Ringo',
          last_name: 'Starr',
        },
        {
          id: 2,
          first_name: 'John',
          last_name: 'Lennon',
        },
        {
          id: 3,
          first_name: 'Paul',
          last_name: 'McCartney',
        },
      ]

      const wrapper = mount(BTable, {
        props: {
          fields,
          items,
          stacked: true,
        },
      })

      const trs = wrapper.findAll('tr')
      trs.forEach((tr) => {
        const tds = tr.findAll('td')
        tds.forEach((td, colIndex) => {
          const field = fields[colIndex]
          expect(td.attributes('data-label')).toBe(field.label)
        })
      })
    })

    it('stacked mode breakpoint label', () => {
      const fields = [
        {
          key: 'id',
          label: 'The ID',
        },
        {
          key: 'first_name',
          label: 'this is the first name',
        },
        {
          key: 'last_name',
          label: 'this is the last name',
        },
      ]
      const items = [
        {
          id: 1,
          first_name: 'Ringo',
          last_name: 'Starr',
        },
        {
          id: 2,
          first_name: 'John',
          last_name: 'Lennon',
        },
        {
          id: 3,
          first_name: 'Paul',
          last_name: 'McCartney',
        },
      ]

      const wrapper = mount(BTable, {
        props: {
          fields,
          items,
          stacked: 'md',
        },
      })

      const trs = wrapper.findAll('tr')
      trs.forEach((tr) => {
        const tds = tr.findAll('td')
        tds.forEach((td, colIndex) => {
          const field = fields[colIndex]
          expect(td.attributes('data-label')).toBe(field.label)
        })
      })
    })

    it('does not have duplicate labels when both labelstacked and label', () => {
      const fields = [
        {
          key: 'id',
          label: 'The ID',
        },
        {
          key: 'first_name',
          label: 'this is the first name',
        },
        {
          key: 'last_name',
          label: 'this is the last name',
        },
      ]

      const items = [
        {
          id: 1,
          first_name: 'Ringo',
          last_name: 'Starr',
        },
        {
          id: 2,
          first_name: 'John',
          last_name: 'Lennon',
        },
        {
          id: 3,
          first_name: 'Paul',
          last_name: 'McCartney',
        },
      ]

      const wrapper = mount(BTable, {
        props: {
          fields,
          items,
          stacked: true,
          labelStacked: true,
        },
      })

      const labels = wrapper.findAll('label')
      expect(labels.length).toBe(9)
      const dataLabels = wrapper.findAll('[data-label]')
      expect(dataLabels.length).toBe(0)
    })
  })
})
