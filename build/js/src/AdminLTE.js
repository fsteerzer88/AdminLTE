/*!
 * AdminLTE v3.0.0-alpha (https://almsaeedstudio.com)
 * Copyright 2014-2016 Abdullah Almsaeed <abdullah@almsaeedstudio.com>
 * Project website Almsaeed Studio (https://almsaeedstudio.com)
 * Licensed under MIT (https://github.com/almasaeed2010/AdminLTE/blob/master/LICENSE)
 */
const Layout = (($) => {
  'use strict'

  /**
   * Constants
   * ====================================================
   */

  const NAME = 'Layout'
  const DATA_KEY = 'lte.layout'
  const EVENT_KEY = `.${DATA_KEY}`
  const JQUERY_NO_CONFLICT = $.fn[NAME]

  const Event = {
    SIDEBAR: 'sidebar'
  }

  const Selector = {
    SIDEBAR: '.main-sidebar',
    HEADER: '.main-header',
    CONTENT: '.content-wrapper',
    CONTENT_HEADER: '.content-header',
    WRAPPER: '.wrapper',
    CONTROL_SIDEBAR: '.control-sidebar',
    LAYOUT_FIXED: '.layout-fixed',
    FOOTER: '.main-footer'
  }

  const ClassName = {
    HOLD: 'hold-transition',
    SIDEBAR: 'main-sidebar',
    LAYOUT_FIXED: 'layout-fixed'
  }

  /**
   * Class Definition
   * ====================================================
   */

  class Layout {

    constructor(element) {
      this._element = element

      this._init()
    }

    // Public

    fixLayoutHeight() {
      let heights = [
          $(window).height(),
          $(Selector.HEADER).outerHeight(),
          $(Selector.FOOTER).outerHeight(),
          $(Selector.SIDEBAR).height()
        ],
        max = this._max(heights)

      $(Selector.CONTENT).css('min-height', max - (heights[1] + heights[2]))
    }

    // Private

    _init() {
      $('body').removeClass(ClassName.HOLD)

      this.fixLayoutHeight()
      $(Selector.SIDEBAR).on('collapsed.lte.treeview expanded.lte.treeview collapsed.lte.pushmenu expanded.lte.pushmenu', () => {
        this.fixLayoutHeight()
      })
      $(window).resize(() => {
        this.fixLayoutHeight()
      })
    }

    _max(numbers) {
      let max = 0

      numbers.forEach((v) => {
        if (v > max) {
          max = v
        }
      })

      return max
    }

    // Static

    static _jQueryInterface(operation) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)

        if (!data) {
          data = new Layout(this)
          $(this).data(DATA_KEY, data)
        }

        if (operation) {
          data[operation]()
        }
      })
    }
  }

  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME] = Layout._jQueryInterface
  $.fn[NAME].Constructor = Layout
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Layout._jQueryInterface
  }

  return Layout

})(jQuery)

const Treeview = (($) => {

  /**
   * Constants
   * ====================================================
   */

  const NAME               = 'Treeview'
  const DATA_KEY           = 'lte.treeview'
  const EVENT_KEY          = `.${DATA_KEY}`
  const JQUERY_NO_CONFLICT = $.fn[NAME]

  const Event = {
    SELECTED: `selected${EVENT_KEY}`,
    EXPANDED: `expanded${EVENT_KEY}`,
    COLLAPSED: `collapsed${EVENT_KEY}`,
    LOAD_DATA_API: `load${EVENT_KEY}`
  }

  const Selector = {
    LI: '.nav-item',
    LINK: '.nav-link',
    TREEVIEW_MENU: '.nav-treeview',
    OPEN: '.menu-open',
    DATA_WIDGET: '[data-widget="treeview"]'
  }

  const ClassName = {
    LI: 'nav-item',
    LINK: 'nav-link',
    TREEVIEW_MENU: 'nav-treeview',
    OPEN: 'menu-open'
  }

  const Default = {
    trigger: `${Selector.DATA_WIDGET} ${Selector.LINK}`,
    animationSpeed: 300,
    accordion: true
  }

  /**
   * Class Definition
   * ====================================================
   */
  class Treeview {

    constructor(element, config) {
      this._config  = config
      this._element = element
    }

    // Public

    init() {
      this._setupListeners()
    }

    expand(treeviewMenu, parentLi) {
      let expandedEvent = $.Event(Event.EXPANDED)

      if (this._config.accordion) {
        let openMenuLi   = parentLi.siblings(Selector.OPEN).first()
        let openTreeview = openMenuLi.find(Selector.TREEVIEW_MENU).first()
        this.collapse(openTreeview, openMenuLi)
      }

      treeviewMenu.slideDown(this._config.animationSpeed, () => {
        parentLi.addClass(ClassName.OPEN)
        $(this._element).trigger(expandedEvent)
      })
    }

    collapse(treeviewMenu, parentLi) {
      let collapsedEvent = $.Event(Event.COLLAPSED)

      treeviewMenu.slideUp(this._config.animationSpeed, () => {
        parentLi.removeClass(ClassName.OPEN)
        $(this._element).trigger(collapsedEvent)
        treeviewMenu.find(`${Selector.OPEN} > ${Selector.TREEVIEW_MENU}`).slideUp()
        treeviewMenu.find(Selector.OPEN).removeClass(ClassName.OPEN)
      })
    }

    collapseAll() {

    }

    expandAll() {

    }

    toggle(event) {
      let $relativeTarget = $(event.currentTarget)
      let treeviewMenu    = $relativeTarget.next()

      if (!treeviewMenu.is(Selector.TREEVIEW_MENU)) {
        return
      }

      event.preventDefault()

      let parentLi = $relativeTarget.parents(Selector.LI).first()
      let isOpen   = parentLi.hasClass(ClassName.OPEN)

      if (isOpen) {
        this.collapse($(treeviewMenu), parentLi)
      } else {
        this.expand($(treeviewMenu), parentLi)
      }
    }

    // Private

    _setupListeners() {
      $(document).on('click', this._config.trigger, (event) => {
        this.toggle(event)
      })
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data    = $(this).data(DATA_KEY)
        let _config = $.extend({}, Default, $(this).data())

        if (!data) {
          data = new Treeview($(this), _config)
          $(this).data(DATA_KEY, data)
        }

        if (config === 'init') {
          data[config]()
        }
      })
    }

  }

  /**
   * Data API
   * ====================================================
   */

  $(window).on(Event.LOAD_DATA_API, () => {
    $(Selector.DATA_WIDGET).each(function () {
      let $treeview = $(this)
      Treeview._jQueryInterface.call($treeview, 'init')
    })
  })

  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME] = Treeview._jQueryInterface
  $.fn[NAME].Constructor = Treeview
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Treeview._jQueryInterface
  }

  return Treeview

})(jQuery)

const PushMenu = (($) => {
  'use strict'

  /**
   * Constants
   * ====================================================
   */

  const NAME = 'PushMenu'
  const DATA_KEY = 'lte.pushmenu'
  const EVENT_KEY = `.${DATA_KEY}`
  const JQUERY_NO_CONFLICT = $.fn[NAME]

  const Event = {
    COLLAPSED: `collapsed${EVENT_KEY}`,
    SHOWN: `shown${EVENT_KEY}`
  }

  const Selector = {
    COLLAPSED: 'sidebar-collapse',
    TOGGLE_BUTTON: '[data-widget="pushmenu"]'
  }

  /**
   * Class Definition
   * ====================================================
   */

  class PushMenu {

    constructor(element) {
      this._element = element
      this._isShown = !$('body').hasClass(Selector.COLLAPSED) || $('body').hasClass('sidebar-open')
    }

    // Public

    show() {
      $('body').addClass('sidebar-open')
        .removeClass(Selector.COLLAPSED)

      this._isShown = true

      let shownEvent = $.Event(Event.SHOWN)
      $(this._element).trigger(shownEvent)
    }

    collapse() {
      $('body').removeClass('sidebar-open')
        .addClass(Selector.COLLAPSED)

      this._isShown = false

      let collapsedEvent = $.Event(Event.COLLAPSED)
      $(this._element).trigger(collapsedEvent)
    }

    toggle() {

      if (typeof this._isShown === 'undefined') {
        this._isShown = !$('body').hasClass(Selector.COLLAPSED) || $('body').hasClass('sidebar-open')
      }

      if (this._isShown) {
        this.collapse()
      } else {
        this.show()
      }
    }

    // Static

    static _jQueryInterface(operation) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)

        if (!data) {
          data = new PushMenu(this)
          $(this).data(DATA_KEY, data)
        }

        if (operation) {
          data[operation]()
        }
      })
    }
  }

  /**
   * Data API
   * ====================================================
   */

  $(document).on('click', Selector.TOGGLE_BUTTON, (event) => {
    event.preventDefault()

    let button = event.currentTarget

    if ($(button).data('widget') !== 'pushmenu') {
      button = $(button).closest(Selector.TOGGLE_BUTTON)
    }

    PushMenu._jQueryInterface.call($(button), 'toggle')
  })

  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME] = PushMenu._jQueryInterface
  $.fn[NAME].Constructor = PushMenu
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return PushMenu._jQueryInterface
  }

  return PushMenu

})(jQuery)

const Widget = (($) => {
  'use strict'

  class Widget {

    constructor(element) {
      this._element = element
    }

    static _jQueryInterface(element) {
      let $this = $(element)
      $this.show()
    }
  }

  return Widget

})(jQuery)
