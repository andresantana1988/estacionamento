interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);
    function calcTempo(mil: number) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }


    function patio() {

        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        };
        function salvar(veiculos: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        };
        function adicionar(veiculo: Veiculo, salva?: boolean) {
            limpar();
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class = "delete" data-placa = "${veiculo.placa}">Remover</button>
            </td>
            `

            row.querySelector(".delete")?.addEventListener("click", function () {
                remover(this.dataset.placa)
            })
            $("#patio")?.appendChild(row);
            //os três pontinhos indica que ele trará todos os dados da função ler
            if (salva) salvar([...ler(), veiculo]);
        };
        function remover(placa: string) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            // o getTime obtém o tempo em milisegundos
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();

        };

        function render() {

            // apaga todo o conteúdo do table body
            // cuidado ao utilzar o force(!), pois ele obriga que a propriedade exista e caso não exista ,  retornará um erro
            $("#patio")!.innerHTML = "";
            const patio = ler();
            // valida o tamanho do pátio
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        };
        return { ler, adicionar, remover, salvar, render };
    };
    patio().render();
    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value.toUpperCase();
        const placa = $("#placa")?.value;
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
