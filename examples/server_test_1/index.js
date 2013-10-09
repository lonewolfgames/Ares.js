require({
        baseUrl: "node_modules/ares/src/"
    },
	[
        "ares"
    ],
    function(Ares) {

        Ares.globalize();

        app = new ClientApp({
            debug: true
        });
		
		app.on("init", function(){
			app.connect();
		});
		
        app.init();
    }
);
