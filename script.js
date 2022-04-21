(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        ;
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        ;
        function adicionar(veiculo, salva) {
            var _a, _b;
            limpar();
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class = "delete" data-placa = "${veiculo.placa}">Remover</button>
            </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            //os três pontinhos indica que ele trará todos os dados da função ler
            if (salva)
                salvar([...ler(), veiculo]);
        }
        ;
        function remover(placa) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            // o getTime obtém o tempo em milisegundos
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`))
                return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        ;
        function render() {
            // apaga todo o conteúdo do table body
            // cuidado ao utilzar o force(!), pois ele obriga que a propriedade exista e caso não exista ,  retornará um erro
            $("#patio").innerHTML = "";
            const patio = ler();
            // valida o tamanho do pátio
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        ;
        return { ler, adicionar, remover, salvar, render };
    }
    ;
    patio().render();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value.toUpperCase();
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert("o Nome e a placa são obrigatórios");
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
    function limpar() {
        let nomeCarro = $("#nome");
        let placaCarro = $("#placa");
        nomeCarro.value = "";
        placaCarro.value = "";
    }
})();
