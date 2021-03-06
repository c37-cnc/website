(function (window) {
    'use strict';

    var _validationAddressSend = false,
        _config = null;


    function events() {

        // para a manutencao do banco de dados
        if (document.URL.indexOf('release') > 0) {
            c37.library.database.manager.release(_config.database.name);

            setTimeout(function () {
                c37.library.database.manager.release(_config.database.name);
            }, 300);
        }
        // para a manutencao do banco de dados

        // para o botao de assinatura de cad
        if (document.URL.indexOf('shop') === -1 && document.URL.indexOf('cad') > 0) {
            document.getElementById('button-cad-subscribe').onclick = function () {

                var product = {
                    // uuid: c37.library.utility.math.uuid(16, 16),
                    uuid: '182f2ded6d07ec4b',
                    name: 'Assinatura C37 - CAD',
                    value: 1.00,
                    quantity: 1
                };

                shop.bag.add(product, function () {
                    setTimeout(function () {
                        window.location.href = "/shop/bag.html";
                    }, 400);

                });

            };
        }
        // para o botao de assinatura de cad

        // para o botao de compra de C37 - Router CNC
        if (document.URL.indexOf('shop') === -1 && document.URL.indexOf('equipment') > 0 && document.URL.indexOf('75') > 0) {
            document.getElementById('button-router-cnc-buy').onclick = function () {

                var product = {
                    // uuid: c37.library.utility.math.uuid(16, 16),
                    uuid: 'fc3db275ccc3ec0c',
                    name: 'C37 - Router CNC - 75',
                    value: 3930.00,
                    quantity: 1
                };

                shop.bag.add(product, function () {
                    setTimeout(function () {
                        window.location.href = "/shop/bag.html";
                    }, 400);

                });

            };
        }
        // para o botao de compra de C37 - Router CNC



        // para o carregar da pagina de bag
        if (document.URL.indexOf('shop') > 0 && document.URL.indexOf('bag') > 0) {

            shop.bag.list(function (error, products) {

                // se tenho itens salvos na sacola
                if (products && Array.isArray(products) && products.length > 0) {

                    // os produtos
                    products.forEach(function (product) {

                        var trProduct = document.createElement('tr');

                        var tdImg = document.createElement('td'),
                            tdDescription = document.createElement('td'),
                            tdQuantity = document.createElement('td'),
                            tdRemove = document.createElement('td'),
                            tdValue = document.createElement('td'),
                            tdTotalValue = document.createElement('td');

                        var imgProduct = document.createElement('i'),
                            spanDescription = document.createElement('span'),
                            inputQuantity = document.createElement('input'),
                            imgRemove = document.createElement('i'),
                            spanValue = document.createElement('span'),
                            spanTotalValue = document.createElement('span');


                        imgProduct.classList.add('icon-nav-cad');
                        tdImg.setAttribute('style', 'padding-left: 5px');
                        tdImg.appendChild(imgProduct);

                        spanDescription.textContent = product.name;
                        tdDescription.appendChild(spanDescription);

                        imgRemove.classList.add('icon-remove');
                        imgRemove.dataset.uuid = product.uuid;
                        tdRemove.setAttribute('style', 'padding-left:3px;padding-right: 1px;')
                        tdRemove.appendChild(imgRemove);

                        imgRemove.onclick = function () {

                            var uuid = this.dataset.uuid;

                            this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);

                            c37.library.database.operation.remove('bag', uuid).then(() => {
                                if (calculeTotalAmount() === 0) {

                                    // escondo a mensagem de sacola vazia
                                    document.getElementById('div-bag-empty').classList.remove('hide');

                                    // escondo a tabela
                                    document.getElementById('table-bag-products').classList.add('hide');
                                    document.getElementById('link-bag-redirect').classList.add('hide');

                                }
                            });

                        }


                        inputQuantity.type = "number";
                        inputQuantity.value = product.quantity;
                        inputQuantity.min = '1';
                        inputQuantity.increment = '1';
                        inputQuantity.setAttribute('style', 'padding:0;margin:0px!important;');
                        tdQuantity.setAttribute('style', 'width:40px;');
                        tdQuantity.appendChild(inputQuantity);

                        inputQuantity.onclick = inputQuantity.onchange = function () {

                            // atualizando a quantidade no produto
                            product.quantity = this.value;

                            // realizando os calculos para os valores
                            var actualTotalValue = product.value * product.quantity;

                            // atualizando o valor total para o item 
                            spanTotalValue.textContent = 'R$ ' + c37.library.utility.math.parseNumber(actualTotalValue, 2);

                            // atualizando o valor total para todos os itens
                            document.getElementById('strong-total-amount').textContent = 'R$ ' + c37.library.utility.math.parseNumber(actualTotalValue, 2);

                            // atualizando o valor da quantidade do determinado item no banco de dados
                            c37.library.database.operation.add('bag', product.uuid, product);

                            calculeTotalAmount();

                        }


                        spanValue.textContent = 'R$ ' + c37.library.utility.math.parseNumber(product.value, 2);
                        tdValue.classList.add('text-right');
                        tdValue.setAttribute('style', 'width:110px');
                        tdValue.appendChild(spanValue);


                        spanTotalValue.textContent = 'R$ ' + c37.library.utility.math.parseNumber(product.value * product.quantity, 2);
                        tdTotalValue.classList.add('text-right');
                        tdTotalValue.classList.add('total-value-product');
                        tdTotalValue.setAttribute('style', 'width:110px');
                        tdTotalValue.appendChild(spanTotalValue);




                        trProduct.appendChild(tdImg);
                        trProduct.appendChild(tdDescription);
                        trProduct.appendChild(tdQuantity);
                        trProduct.appendChild(tdRemove);
                        trProduct.appendChild(tdValue);
                        trProduct.appendChild(tdTotalValue);

                        document.getElementById('table-bag-products').querySelector('tbody').appendChild(trProduct);

                    });

                    calculeTotalAmount();

                    // escondo o loader
                    document.getElementById('div-bag-verify').classList.add('hide');

                    // mostro a tabela
                    document.getElementById('table-bag-products').classList.remove('hide');
                    document.getElementById('link-bag-redirect').classList.remove('hide');

                } else {
                    // escondo o loader
                    document.getElementById('div-bag-verify').classList.add('hide');

                    // escondo a mensagem de sacola vazia
                    document.getElementById('div-bag-empty').classList.remove('hide');
                }

            });

        }
        // para o carregar da pagina de bag

        // para o carregar da pagina de checkout
        if (document.URL.indexOf('shop') > 0 && document.URL.indexOf('checkout') > 0) {

            // para o campo de cartao de credito
            VMasker(document.getElementById('text-user-credit-card-number')).maskPattern('9999999999999999999');
            // para o campo de cartao de credito

            // para o campo de codigo de seguranca
            VMasker(document.getElementById('text-user-credit-card-code')).maskPattern('9999');
            // para o campo de codigo de seguranca




            // para o botao de continue em checkout - products
            document.getElementById('button-checkout-products').onclick = function () {
                document.getElementById('collapse-checkout').setSelected('collapse-address');
            }
            // para o botao de continue em checkout - products

            // para o botao de continue em checkout - address
            document.getElementById('button-checkout-address').onclick = function () {

                // removendo os requireds
                document.getElementById('text-user-documment').classList.remove('required');
                document.getElementById('text-user-phone-code').classList.remove('required');
                document.getElementById('text-user-phone-number').classList.remove('required');
                document.getElementById('text-address-street').classList.remove('required');
                document.getElementById('text-address-district').classList.remove('required');
                document.getElementById('text-address-zipcode').classList.remove('required');
                document.getElementById('text-address-city').classList.remove('required');
                document.getElementById('option-address-state').classList.remove('required');
                // removendo os requireds

                var validation = [];

                if (document.getElementById('text-user-documment').value === '') {
                    document.getElementById('text-user-documment').classList.add('required');
                    validation.push('text-user-documment');
                }

                if (document.getElementById('text-user-phone-code').value === '') {
                    document.getElementById('text-user-phone-code').classList.add('required');
                    validation.push('text-user-phone-code');
                }

                if (document.getElementById('text-user-phone-number').value === '') {
                    document.getElementById('text-user-phone-number').classList.add('required');
                    validation.push('text-user-phone-number');
                }

                if (document.getElementById('text-address-street').value === '') {
                    document.getElementById('text-address-street').classList.add('required');
                    validation.push('text-address-street');
                }

                if (document.getElementById('text-address-district').value === '') {
                    document.getElementById('text-address-district').classList.add('required');
                    validation.push('text-address-district');
                }

                if (document.getElementById('text-address-zipcode').value === '') {
                    document.getElementById('text-address-zipcode').classList.add('required');
                    validation.push('text-address-zipcode');
                }

                if (document.getElementById('text-address-city').value === '') {
                    document.getElementById('text-address-city').classList.add('required');
                    validation.push('text-address-city');
                }

                if (document.getElementById('option-address-state').dataset.selected === '') {
                    document.getElementById('option-address-state').classList.add('required');
                    validation.push('option-address-state');
                }

                _validationAddressSend = (validation.length === 0);

                // se estiver tudo verificado
                if (_validationAddressSend) {
                    // vamos para a aba de pagamento
                    document.getElementById('collapse-checkout').setSelected('collapse-payment');
                }

            }
            // para o botao de continue em checkout - address

            // para o botao de continue em checkout - payment
            document.getElementById('button-checkout-payment').onclick = function () {

                // atualizando a verificacao 
                document.getElementById('button-checkout-address').click();

                // esta atualmente validada?
                if (_validationAddressSend) {

                    // removendo os requireds
                    document.getElementById('text-user-credit-card-name').classList.remove('required');
                    document.getElementById('text-user-credit-card-number').classList.remove('required');
                    document.getElementById('text-user-credit-card-code').classList.remove('required');
                    document.getElementById('option-user-credit-card-month').classList.remove('required');
                    document.getElementById('option-user-credit-card-year').classList.remove('required');
                    // removendo os requireds

                    var validation = [];

                    if (document.getElementById('text-user-credit-card-name').value === '') {
                        document.getElementById('text-user-credit-card-name').classList.add('required');
                        validation.push('text-user-credit-card-name');
                    }
                    if (document.getElementById('text-user-credit-card-number').value === '') {
                        document.getElementById('text-user-credit-card-number').classList.add('required');
                        validation.push('text-user-credit-card-number');
                    }
                    if (document.getElementById('text-user-credit-card-code').value === '') {
                        document.getElementById('text-user-credit-card-code').classList.add('required');
                        validation.push('text-user-credit-card-code');
                    }
                    if (document.getElementById('option-user-credit-card-month').dataset.selected === '') {
                        document.getElementById('option-user-credit-card-month').classList.add('required');
                        validation.push('option-user-credit-card-month');
                    }
                    if (document.getElementById('option-user-credit-card-year').dataset.selected === '') {
                        document.getElementById('option-user-credit-card-year').classList.add('required');
                        validation.push('option-user-credit-card-year');
                    }


                    if (validation.length === 0) {

                        c37.library.database.operation.list('user', function (error, users) {

                            // a validacao para o usuario autenticado
                            if (!error && users && Array.isArray(users) && users.length > 0) {

                                // https://github.com/ContaAzul/creditcard.js
                                var creditCard = new CreditCard();
                                var creditCardBrand = creditCard.getCreditCardNameByNumber(document.getElementById('text-user-credit-card-number').value);

                                creditCardBrand = creditCardBrand.indexOf('invalid') > -1 ? "Visa" : creditCardBrand;

                                // debugger

                                // vou buscar a lista de produtos
                                c37.library.database.operation.list('bag', function (error, products) {

                                    // monto o pedido
                                    var order = {
                                        uuid: c37.library.utility.math.uuid(11, 16),
                                        user: {
                                            uuid: users[0].uuid,
                                            document: {
                                                type: 'cpf',
                                                number: document.getElementById('text-user-documment').value
                                            },
                                            phone: {
                                                type: 'mobile',
                                                code: document.getElementById('text-user-phone-code').value,
                                                number: document.getElementById('text-user-phone-number').value
                                            }
                                        },
                                        products: products,
                                        amount: document.getElementById('strong-total-amount').textContent.replace(/[^\d\.]/g, ''),
                                        address: {
                                            type: document.getElementById('option-address-type').dataset.selected,
                                            street: document.getElementById('text-address-street').value,
                                            complement: document.getElementById('text-address-complement').value,
                                            district: document.getElementById('text-address-district').value,
                                            zipcode: document.getElementById('text-address-zipcode').value,
                                            city: document.getElementById('text-address-city').value,
                                            state: document.getElementById('option-address-state').dataset.selected
                                        },
                                        payment: {
                                            type: document.getElementById('checkbox-card-type').dataset.selected,
                                            brand: creditCardBrand,
                                            name: document.getElementById('text-user-credit-card-name').value,
                                            number: document.getElementById('text-user-credit-card-number').value,
                                            code: document.getElementById('text-user-credit-card-code').value,
                                            validity: {
                                                month: document.getElementById('option-user-credit-card-month').dataset.selected,
                                                year: document.getElementById('option-user-credit-card-year').dataset.selected
                                            },
                                            installment: document.getElementById('option-buy-installment').dataset.selected

                                        }
                                    };
                                    // monto o pedido

                                    document.getElementById('div-checkout-verify').classList.remove('hide');
                                    document.getElementById('div-checkout-failure').classList.add('hide');
                                    document.getElementById('button-checkout-payment').classList.add('disabled');

                                    c37.library.utility.net.request({
                                        method: "POST",
                                        url: "https://us-central1-c37-account.cloudfunctions.net/order",
                                        body: JSON.stringify(order)
                                    }).then(data => {

                                        // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie ???
                                        if (data.code === 200) {

                                            // limpamos a sacola
                                            shop.bag.clear().then(function () {

                                                var order = JSON.parse(data.message);

                                                c37.library.database.operation.add('order', order.uuid, order, function (error) {
                                                    window.location.href = "/shop/order.html#" + order.uuid;
                                                });

                                                return;

                                            });

                                        } else {


                                            // limpando os campos do cartao de credito
                                            document.getElementById('text-user-credit-card-number').value = '';
                                            // limpando os campos do codigo de ceguranca
                                            document.getElementById('text-user-credit-card-code').value = '';


                                            // nao autorizado - verificar mensagem
                                            if (data.code === 401) {

                                                var integrationMessage = JSON.parse(data.message);
                                                // console.log(integrationMessage);

                                                if (integrationMessage.status.code === 0) {
                                                    document.getElementById('p-checkout-failure-message').innerHTML = 'Seu pagamento não foi autorizado, tente outro cartão ou verifique com a administradora de seu cartão. <br> Código: ' + integrationMessage.status.message;
                                                } else if (integrationMessage.status.code === 3) {
                                                    document.getElementById('p-checkout-failure-message').innerHTML = 'Seu pagamento não foi autorizado, tente outro cartão de crédito. <br> Código: ' + integrationMessage.status.message;
                                                } else if (integrationMessage.status.code === 13) {
                                                    document.getElementById('p-checkout-failure-message').textContent = 'Falha no processamento do pagamento. Tente mais tarde ou entre em contato com um de nossos canais de atendimento';
                                                }

                                                // else if (integrationMessage.status.code === 70) {
                                                //     document.getElementById('p-checkout-failure-message').textContent = 'Houve problemas com seu cartão de crédito, verifique com a administradora de seu cartão de crédito.';
                                                // } else if (integrationMessage.status.code === 77) {
                                                //     document.getElementById('p-checkout-failure-message').textContent = 'Seu cartão esta cancelado, tente outro cartão de crédito.';
                                                // } else if (integrationMessage.status.code === 99) {
                                                //     document.getElementById('p-checkout-failure-message').textContent = 'O tempo de solicitação foi atingido, tente mais tarde.';
                                                // } else if (integrationMessage.status.code === 51) {
                                                //     document.getElementById('p-checkout-failure-message').textContent = 'Seu pedido nao foi autorizado, tente outro cartão de crédito.';
                                                // } else {
                                                //     document.getElementById('p-checkout-failure-message').textContent = 'Seu pedido nao foi autorizado, verifique com a administradora de seu cartão de crédito.';
                                                // }

                                                document.getElementById('div-checkout-verify').classList.add('hide');
                                                document.getElementById('div-checkout-failure').classList.remove('hide');
                                                document.getElementById('button-checkout-payment').classList.remove('disabled');

                                                return;

                                            }

                                            // erro no servidor
                                            if (data.code === 500) {

                                                // console.log(data.message);

                                                document.getElementById('div-checkout-verify').classList.add('hide');
                                                document.getElementById('div-checkout-failure').classList.remove('hide');
                                                document.getElementById('button-checkout-payment').classList.remove('disabled');

                                                document.getElementById('p-checkout-failure-message').textContent = 'Informações inconsistentes, tente outro cartão ou verifique com a administradora.';

                                                return;

                                            }


                                        }

                                    });

                                });

                            } else {
                                c37.application.website.user.auth.show();
                            }


                        });

                    }


                } else {
                    // se nao estiver, votamos para o campo a ser preenchido
                    document.getElementById('collapse-checkout').setSelected('collapse-address');
                }

            }
            // para o botao de continue em checkout - payment


            // preenchendo os produtos selecionados para a compra
            shop.bag.list(function (error, products) {

                // se tenho itens salvos na sacola
                if (products && Array.isArray(products) && products.length > 0) {

                    // os produtos
                    products.forEach(function (product) {

                        var trProduct = document.createElement('tr');

                        var tdImg = document.createElement('td'),
                            tdDescription = document.createElement('td'),
                            tdQuantity = document.createElement('td'),
                            tdValue = document.createElement('td'),
                            tdTotalValue = document.createElement('td');

                        var imgProduct = document.createElement('i'),
                            spanDescription = document.createElement('span'),
                            spantQuantity = document.createElement('span'),
                            spanValue = document.createElement('span'),
                            spanTotalValue = document.createElement('span');


                        imgProduct.classList.add('icon-nav-cad');
                        tdImg.setAttribute('style', 'padding-left: 5px');
                        tdImg.appendChild(imgProduct);


                        spanDescription.textContent = product.name;
                        tdDescription.appendChild(spanDescription);


                        spantQuantity.textContent = product.quantity;
                        tdQuantity.appendChild(spantQuantity);


                        spanValue.textContent = 'R$ ' + c37.library.utility.math.parseNumber(product.value, 2);
                        tdValue.classList.add('text-right');
                        tdValue.setAttribute('style', 'width:110px');
                        tdValue.appendChild(spanValue);


                        spanTotalValue.textContent = 'R$ ' + c37.library.utility.math.parseNumber(product.value * product.quantity, 2);
                        tdTotalValue.classList.add('text-right');
                        tdTotalValue.classList.add('total-value-product');
                        tdTotalValue.setAttribute('style', 'width:110px');
                        tdTotalValue.appendChild(spanTotalValue);


                        trProduct.appendChild(tdImg);
                        trProduct.appendChild(tdDescription);
                        trProduct.appendChild(tdQuantity);
                        trProduct.appendChild(tdValue);
                        trProduct.appendChild(tdTotalValue);

                        document.getElementById('table-checkout-products').querySelector('tbody').appendChild(trProduct);

                    });

                    calculeTotalAmount();

                    // verificando se vamos habilitar o parcelamento
                    var totalAmount = document.getElementById('strong-total-amount').textContent.replace(/[^\d\.]/g, '');
                    totalAmount = parseFloat(totalAmount);
                    console.log(totalAmount)

                    if (totalAmount > 3000){

                        // vamos preencher os valores do parcelamento
                        for (var i = 1; i <= 12; i++) {
                          
                            var element = document.getElementById('span-buy-installment-'+ i);

                            if (element) {
                                if (i === 1) {
                                    element.textContent +=  ' ' + document.getElementById('strong-total-amount').textContent;
                                    document.getElementById('strong-buy-installment').textContent +=  ' ' + document.getElementById('strong-total-amount').textContent;
                                }  else {
                                    element.textContent +=  ' R$' + c37.library.utility.math.parseNumber((totalAmount / i), 2) + ' sem juros';
                                }
                            }
                            
                        }

                        // vamos preencher os valores do parcelamento

                        document.getElementById('div-buy-installment').classList.remove('hide');
                    }
                    // verificando se vamos habilitar o parcelamento


                    document.getElementById('collapse-checkout').classList.remove('hide');

                } else {
                    // se nao, retorno para a a sacola
                    window.location.href = "/shop/bag.html";
                }

            });

        }
        // para o carregar da pagina de checkout

        // para o carregar da pagina de order
        if (document.URL.indexOf('shop') > 0 && document.URL.indexOf('order') > 0) {

            var orderUuid = document.URL.split('#')[document.URL.split('#').length - 1];

            if (orderUuid.length === 11) {

                c37.library.database.operation.get('order', orderUuid, function (error, order) {
                    if (!error && order) {

                        // console.log(order);

                        // preenchendo o numero do pedido
                        document.querySelectorAll('.span-order-number').forEach(function (element) {
                            element.textContent = order.uuid;
                        }, this);;

                        // preenchendo os produtos que compoe o pedido
                        order.products.forEach(function (product) {

                            var trProduct = document.createElement('tr');

                            var tdImg = document.createElement('td'),
                                tdDescription = document.createElement('td'),
                                tdQuantity = document.createElement('td'),
                                tdValue = document.createElement('td'),
                                tdTotalValue = document.createElement('td');

                            var imgProduct = document.createElement('i'),
                                spanDescription = document.createElement('span'),
                                spantQuantity = document.createElement('span'),
                                spanValue = document.createElement('span'),
                                spanTotalValue = document.createElement('span');


                            imgProduct.classList.add('icon-nav-cad');
                            tdImg.setAttribute('style', 'padding-left: 5px');
                            tdImg.appendChild(imgProduct);


                            spanDescription.textContent = product.name;
                            tdDescription.appendChild(spanDescription);


                            spantQuantity.textContent = product.quantity;
                            tdQuantity.classList.add('text-right');
                            tdQuantity.appendChild(spantQuantity);


                            spanValue.textContent = 'R$ ' + c37.library.utility.math.parseNumber(product.value, 2);
                            tdValue.classList.add('text-right');
                            tdValue.setAttribute('style', 'width:110px');
                            tdValue.appendChild(spanValue);


                            spanTotalValue.textContent = 'R$ ' + c37.library.utility.math.parseNumber(product.value * product.quantity, 2);
                            tdTotalValue.classList.add('text-right');
                            tdTotalValue.classList.add('total-value-product');
                            tdTotalValue.setAttribute('style', 'width:110px');
                            tdTotalValue.appendChild(spanTotalValue);


                            trProduct.appendChild(tdImg);
                            trProduct.appendChild(tdDescription);
                            trProduct.appendChild(tdQuantity);
                            trProduct.appendChild(tdValue);
                            trProduct.appendChild(tdTotalValue);

                            document.getElementById('table-order-products').querySelector('tbody').appendChild(trProduct);

                        });

                        calculeTotalAmount();


                        document.getElementById('span-user-documment').textContent = order.user.document.number;
                        document.getElementById('span-user-phone-code').textContent = order.user.phone.code;
                        document.getElementById('span-user-phone-number').textContent = order.user.phone.number;

                        document.getElementById('span-address-type').textContent = (order.address.type === 'home' ? 'Casa' : 'Trabalho');
                        document.getElementById('span-address-street').textContent = order.address.street;
                        document.getElementById('span-address-complement').textContent = order.address.complement;
                        document.getElementById('span-address-district').textContent = order.address.district;
                        document.getElementById('span-address-zipcode').textContent = order.address.zipcode;
                        document.getElementById('span-address-city').textContent = order.address.city;
                        document.getElementById('span-address-state').textContent = order.address.state;


                        document.getElementById('span-user-credit-type').textContent = (order.payment.type === 'credit-card' ? 'Cartão de Crédito' : 'Cartão de Débito');
                        document.getElementById('span-user-credit-card-name').textContent = order.payment.name;
                        document.getElementById('span-user-credit-card-number').textContent = order.payment.number;


                        // apresento o numero do pedido e o pedido
                        document.getElementById('div-order-number').classList.remove('hide');
                        document.getElementById('div-order').classList.remove('hide');
                        // apresento o numero do pedido e o pedido

                    } else {
                        window.location.href = "/shop/bag.html";
                    }
                });

            } else {
                window.location.href = "/shop/bag.html";
            }

        }
        // para o carregar da pagina de order

    };



    // para o calculo to valor total da sacola
    function calculeTotalAmount() {

        var totalAmount = 0;

        document.querySelectorAll('.total-value-product').forEach(function (item) {

            // http://stackoverflow.com/questions/10649064/how-to-use-regex-for-currency
            var value = item.textContent.replace(/[^\d\.]/g, '');

            totalAmount += c37.library.utility.math.parseFloat(value, 2);
        });

        // atualizando o valor total para todos os itens
        document.getElementById('strong-total-amount').textContent = 'R$ ' + c37.library.utility.math.parseNumber(totalAmount, 2);

        return totalAmount;

    }







    var shop = {
        initialize: function (config) {

            _config = config;

            events();

        },
        bag: {
            add: function (product, callback) {

                c37.library.database.operation.get('bag', product.uuid, function (error, doc) {
                    if (!error && !doc) {
                        var item = {
                            uuid: product.uuid,
                            name: product.name,
                            value: product.value,
                            quantity: product.quantity
                        }

                        c37.library.database.operation.add('bag', item.uuid, item, function (error) {
                            if (!error) {
                                return callback(true);
                            }
                            throw new Error('Application - Shop - Bag - Failed to Save in the Local Database');
                        });
                    }
                    return callback(true);
                });

            },
            get: function (uuid) {

                return _products[uuid];

            },
            remove: function (uuid) {

                return delete _products[uuid];

            },
            clear: function () {

                return new Promise(function (resolve, reject) {

                    c37.library.database.operation.list('bag').then((products) => {

                        var promises = [];

                        products.forEach(function (product) {
                            promises.push(c37.library.database.operation.remove('bag', product.uuid));
                        });

                        resolve(Promise.all(promises));

                    });

                });

            },
            list: function (callback) {

                c37.library.database.operation.list('bag', function (error, data) {
                    return callback(error, data);
                });

            }
        }
    };




    window.c37.library.utility.object.namespace(window, 'c37.application.website.shop', shop);


    })(window);