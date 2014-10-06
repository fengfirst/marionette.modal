define(["app",
    "tpl!common/modules/modal/templates/view.tpl",
    "tpl!common/modules/modal/templates/header.tpl",
    "common/viewport"
], function(App, viewTpl, headerTpl) {

    App.module("Modules", function(Module, App, Backbone, Marionette, $, _) {
        this.HeaderView = Marionette.ItemView.extend({
            template: headerTpl,
            className: "modal-header"
        });

        this.ModalView = Marionette.ItemView.extend({
            template: viewTpl,
            className: "modal-dialog",
            initialize: function(options) {
                this.moduleView = options.moduleView;
                this.options = options.modalOptions || {};
                this.listenTo(App.Viewport, "resize", _.bind(this.positionModule, this));
            },
            onRender: function() {
                /*if (this.hasHeader()) {
                    this.setHeader();
                }*/

                if (this.getCanDismiss()) {
                    this.getContentContainer().append('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>');
                }
                this.moduleView.render();
                this.getModuleContainer().append(this.getModuleElement());
            },
            onShow: function() {
                this.moduleView.trigger("show");
                this.positionModule();

            },
            positionModule: function() {
                var modalEl = this.getContainer(),
                    displayAttr = modalEl.css("display"),
                    moduleEl = this.getModuleElement(),
                    contentContainer = this.getContentContainer();

                modalEl.css("display", "block");

                var height = moduleEl.outerHeight(),
                    width = moduleEl.outerWidth(),
                    cssAttr = ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"],
                    contentSpace = 0;

                _.each(cssAttr, function(attr) {
                    contentSpace += parseInt(Math.round(contentContainer.css(attr).replace("px", "")), 10);
                });

                modalEl.css("display", displayAttr);

                this.$el.css({
                    marginTop: Math.max(0, ($(window).outerHeight() - height) / 2),
                    width: width + contentSpace
                });
            },
            getContainer: function() {
                return this.$el.parent();
            },
            getContentContainer: function() {
                return this.$(".modal-content");
            },
            getModuleContainer: function() {
                return this.$(".modal-body");
            },
            getModuleElement: function() {
                return this.moduleView.$el;
            },
            setHeader: function() {
                var headerView = new Module.HeaderView();
                headerView.render();

                this.getContentContainer().append(headerView.$el);

                if (this.getCanDismiss()) {
                    headerView.prepend('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>');
                }
            },
            hasHeader: function() {
                return this.options.hasHeader;
            },
            getCanDismiss: function() {
                return this.options.canDismiss || !1;
            }
        });
    });

    return App.Modules;
});