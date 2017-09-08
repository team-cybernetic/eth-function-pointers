App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        return App.initWeb3();
    },

    initWeb3: function() {
        // Initialize web3 and set the provider to the testRPC.
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            //App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545/');
            App.web3Provider = new Web3.providers.HttpProvider('https://www.web3.ttt222.org/');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract: function() {
		$.getJSON('FunctionPointers.json', function(data) {
			// Get the necessary contract artifact file and instantiate it with truffle-contract.
			var FunctionPointersArtifact = data;
			App.contracts.FunctionPointers = TruffleContract(FunctionPointersArtifact);

			// Set the provider for our contract.
			App.contracts.FunctionPointers.setProvider(App.web3Provider);

            App.getAdd();
            App.getNum();
            App.getFactor();
            App.getAddress();

        }).then(function() {
            var functionsInstance;
            web3.eth.getBlock('latest', function(error, result) {
                console.log("latest block result = " + JSON.stringify(result));
                lastblock = result.number;
                console.log("latest block: " + JSON.stringify(lastblock));

                App.contracts.FunctionPointers.deployed().then(function(instance) {
                    functionsInstance = instance;

                    $('#address-main').html(functionsInstance.address.toString());

                    functionsInstance.Swapped({}, {fromBlock: lastblock, toBlock: 'latest'}).watch(function(error, response) {
                        console.log("swapped error = " + JSON.stringify(error));
                        console.log("swapped response = " + JSON.stringify(response));
                        if (!error) {
                            console.log(response.args.sender + " has swapped the function!");
                        }
                        App.getAdd();
                        App.getFactor();
                        App.getAddress();
                    });

                    functionsInstance.Calculated({}, {fromBlock: lastblock, toBlock: 'latest'}).watch(function(error, response) {
                        console.log("calculated error = " + JSON.stringify(error));
                        console.log("calculated response = " + JSON.stringify(response));
                        if (!error) {
                            console.log(response.args.sender + " has calculated " + response.args.numIn + " -> " + response.args.numOut + " [" + (response.args.added == "true" ? "+" : "*") + "]");
                            $('#num').html(response.args.numOut.toString());
                        }
                    });

                    functionsInstance.FactorSet({}, {fromBlock: lastblock, toBlock: 'latest'}).watch(function(error, response) {
                        console.log("factorset error = " + JSON.stringify(error));
                        console.log("factorset response = " + JSON.stringify(response));
                        if (!error) {
                            console.log(response.args.sender + " has set the factor to " + response.args.newFactor.toString());
                            $('#factor').html(response.args.newFactor.toString());
                        }
                    });

                });
            });
        });
        return App.bindEvents();
    },

    bindEvents: function() {
        console.log('binding events');
        $(document).on('click', '#btn-calc', App.calc);
        $(document).on('click', '#btn-swap', App.swap);
        $(document).on('click', '#btn-get', App.getAdd);
        $(document).on('click', '#btn-num', App.getNum);
        $(document).on('click', '#btn-factor', App.setFactor);
    },

    calc: function() {
        event.preventDefault();
        console.log('calc');

        var $numbox = $('#txt-num');
        var num = parseInt($numbox.val(), 10);

        if (num == '' || num == NaN) {
            console.log('bad value ' + $numbox.val());
            $numbox.val('');
            return;
        }

        var $calcbtn = $('#btn-calc');
        $calcbtn.attr('disabled', true);

		var functionsInstance;

		web3.eth.getAccounts(function(error, accounts) {
			if (error) {
				console.log("Error while getting accounts: " + JSON.stringify(error));
                return;
			}

			var account = accounts[0];

			App.contracts.FunctionPointers.deployed().then(function(instance) {
				functionsInstance = instance;
                console.log("calculating...");
                return functionsInstance.doIt(num, {from: account});
            }).then(function(result) {
                console.log("calc result.tx = " + result.tx);
                console.log("calc result.logs = " + JSON.stringify(result.logs));
                console.log("calc result.receipt = " + JSON.stringify(result.receipt));
                $numbox.val('');
                $calcbtn.attr('disabled', false);
			}).catch(function(err) {
				console.log("Error while handling calc: " + err.message);
			});
		});

    },

    swap: function() {
        event.preventDefault();

        var $swapbtn = $('#btn-swap');
        $swapbtn.attr('disabled', true);

		var functionsInstance;

		web3.eth.getAccounts(function(error, accounts) {
			if (error) {
				console.log("Error while getting accounts: " + JSON.stringify(error));
                return;
			}

			var account = accounts[0];

			App.contracts.FunctionPointers.deployed().then(function(instance) {
				functionsInstance = instance;
                console.log("swapping...");
                return functionsInstance.swapIt({from: account});
            }).then(function(result) {
                console.log("swap result.tx = " + result.tx);
                console.log("swap result.logs = " + JSON.stringify(result.logs));
                console.log("swap result.receipt = " + JSON.stringify(result.receipt));
                $swapbtn.attr('disabled', false);
			}).catch(function(err) {
				console.log("Error while handling swap: " + err.message);
			});
		});
    },

    setFactor: function() {
        event.preventDefault();
        console.log('factor');

        var $factorbox = $('#txt-factor');
        var num = parseInt($factorbox.val(), 10);

        if (num == NaN) {
            console.log('bad value ' + $factorbox.val());
            $factorbox.val('');
            return;
        }

        var $factorbtn = $('#btn-factor');
        $factorbtn.attr('disabled', true);

		var functionsInstance;

		web3.eth.getAccounts(function(error, accounts) {
			if (error) {
				console.log("Error while getting accounts: " + JSON.stringify(error));
                return;
			}

			var account = accounts[0];

			App.contracts.FunctionPointers.deployed().then(function(instance) {
				functionsInstance = instance;
                console.log("setting factor ...");
                return functionsInstance.setFactor(num, {from: account});
            }).then(function(result) {
                console.log("factor result.tx = " + result.tx);
                console.log("factor result.logs = " + JSON.stringify(result.logs));
                console.log("factor result.receipt = " + JSON.stringify(result.receipt));
                $factorbox.val('');
                $factorbtn.attr('disabled', false);
			}).catch(function(err) {
				console.log("Error while handling factor: " + err.message);
			});
		});

    },


    getAdd: function() {
		var functionsInstance;

		App.contracts.FunctionPointers.deployed().then(function(instance) {
			functionsInstance = instance;

            console.log('asking for add');
			return functionsInstance.getAdd.call();
		}).then(function(add) {
            console.log('add = ' + add);
            $('#function').html(add == true ? '+' : '*');
		}).catch(function(err) {
			console.log("Error while getting add: " + err.message);
		});

    },

    getNum: function() {
		var functionsInstance;

		App.contracts.FunctionPointers.deployed().then(function(instance) {
			functionsInstance = instance;

            console.log('asking for num');
			return functionsInstance.getNum.call();
		}).then(function(num) {
            console.log('got num: ' + num.toString());
            $('#num').html(num.toString());
		}).catch(function(err) {
			console.log("Error while getting num: " + err.message);
		});

    },

    getFactor: function() {
		var functionsInstance;

		App.contracts.FunctionPointers.deployed().then(function(instance) {
			functionsInstance = instance;

            console.log('asking for factor');
			return functionsInstance.getFactor.call();
		}).then(function(factor) {
            console.log('got factor: ' + factor.toString());
            $('#factor').html(factor.toString());
		}).catch(function(err) {
			console.log("Error while getting factor: " + err.message);
		});

    },

    getAddress: function() {
		var functionsInstance;

		App.contracts.FunctionPointers.deployed().then(function(instance) {
			functionsInstance = instance;

            console.log('asking for address');
			return functionsInstance.getFunctionAddress.call();
		}).then(function(address) {
            console.log('got address: ' + address.toString());
            $('#address-calc').html(address.toString());
		}).catch(function(err) {
			console.log("Error while getting address: " + err.message);
		});

    }
};



$(function() {
    $(window).load(function() {
        App.init();
    });
});
