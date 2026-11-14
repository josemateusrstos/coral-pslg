   const urlBanco = 'https://zkqyrgtdzzaatmjmxcwl.supabase.co'
   const pubKeyBanco = 'sb_publishable_gADGSh4dFjlw_t1SfGT5TQ_NhS7wa5M'
   const bdClient = supabase.createClient(urlBanco, pubKeyBanco)
 


    let todasMusicas = [];
    let naipeSelecionado = sessionStorage.getItem('naipeSelecionado');

    async function carregarDados(naipeSelecionado){

        document.getElementById('labelNaipeAtual').innerText = 'Voz: ' + sessionStorage.getItem('naipeSelecionado');

        if (naipeSelecionado=='Sopranos'){
            const {data, error} = await bdClient.from('musicas').select('*').eq('is_soprano', true)

            if (error) {
                console.log(error);   
            } else {
                todasMusicas = data;
            }
        }
        
        if (naipeSelecionado=='Contraltos'){
            const {data, error} = await bdClient.from('musicas').select('*').eq('is_contralto', true)

            if (error) {
                console.log(error);   
            } else {
                todasMusicas = data;
            }
        }

        if (naipeSelecionado=='Tenores'){
            const {data, error} = await bdClient.from('musicas').select('*').eq('is_tenor', true)

            if (error) {
                console.log(error);   
            } else {
                todasMusicas = data
            }
        }

        if (naipeSelecionado=='Baixos'){
            const {data, error} = await bdClient.from('musicas').select('*').eq('is_baixo', true)

            if (error) {
                console.log(error);   
            } else {
                todasMusicas = data

            }
        }

        if (naipeSelecionado=='Todos'){
            const {data, error} = await bdClient.from('musicas').select('*')

            if (error) {
                console.log(error);   
            } else {
                todasMusicas = data
            }
        }
        return todasMusicas;
        
    }  

    // Converte link Google Drive para iframe
    function converterLinkGoogleDrive(url) {
      if (!url) return '';
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      return url;
    }


    function renderizarMusicas() {
        
        const conteiner = document.getElementById('lista');
        conteiner.innerHTML = '';

        let ordenadas = todasMusicas.sort((a, b) => {
            return a.ordem - b.ordem
        });

        if (ordenadas.length === 0) {
            conteiner.innerHTML = '<div class="carregando">Carregando...</div>';
            return;
        }

        ordenadas.forEach(item => {
            const titulo = item.titulo;
            const naipe =   ['soprano', 'contralto', 'tenor', 'baixo']
                            .filter(voz => item[`is_${voz}`])
                            .map(voz => voz.charAt(0).toUpperCase() +
                                voz.slice(1).toLowerCase());
            const momento = item.ordem;
            const linkDrive = item.link;
            const urlAudio = converterLinkGoogleDrive(linkDrive);          

            const card = document.createElement('div');
            card.className = 'card-musica';
            card.innerHTML = `
            <div class="card-titulo">${titulo}</div>
            <div class="tags">
            ${momento ? `<span class="tag-ordem">${momento}</span>` : ''}
            <span class="tag-naipe">${naipe.join(' - ')}</span>
            </div>
            <iframe 
            src=${urlAudio}
            allow="autoplay">
            </iframe>
            `;
            conteiner.appendChild(card);
        });
    }

async function iniciar() {
    document.getElementById('lista').innerHTML = '<div class="carregando">Carregando...</div>';
    try {
        await carregarDados(naipeSelecionado);
        renderizarMusicas();
    } catch (erro) {
        console.error('Falha na inicialização:', erro);
    }
}

iniciar();