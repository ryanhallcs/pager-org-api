var plugin = {
    register: function (server, options, next) {
        // Get all registered controllers, which expose a getAllRoutes()
        var controllers = options.container.getAll('Controller');
        for (var controller of controllers) {
            server.route(controller.getAllRoutes());
        }
        next();
    }
};

plugin.register.attributes = {  
    name: 'inversifyPlugin',
    version: '1.0.0'
}

module.exports = plugin;