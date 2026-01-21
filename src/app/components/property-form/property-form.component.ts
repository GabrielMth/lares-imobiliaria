import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyRequest, PropertyResponse } from '../../models/property.model';
import { PropertyService } from '../../services/property-service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-form.component.html',
  styleUrl: './property-form.component.css'
})
export class PropertyFormComponent {

  isLoading = false;

  // Lista para guardar os arquivos reais selecionados
  selectedFiles: File[] = [];

  imovel: PropertyRequest = {
    titulo: '',
    descricao: '',
    valor: 0,
    tipoImovel: 'CASA',
    status: 'VENDA',
    areaTotal: 0,
    areaConstruida: 0,
    quartos: 0,
    banheiros: 0,
    vagasGaragem: 0,
    enderecos: {
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: ''
    },
    // urlsFotos não é mais usado no envio aqui, pois mandaremos os arquivos binários
    urlsFotos: []
  };

  constructor(
    private propertyService: PropertyService,
    private router: Router
  ) { }

  // 1. Captura os arquivos quando o usuário seleciona
 onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const novosArquivos = Array.from(files);
    
    // Validação de tamanho (ex: max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB em bytes

    for (let file of novosArquivos) {
      if (file.size > MAX_SIZE) {
        alert(`A imagem "${file.name}" é muito grande! Máximo permitido: 10MB.`);
        return; // Para tudo e não adiciona
      }
    }

    this.selectedFiles = novosArquivos;
  }

  onSubmit() {
    this.isLoading = true;

    // PASSO 1: Salvar os dados de texto
    this.propertyService.createImovel(this.imovel).subscribe({
      next: (response: PropertyResponse) => {
        console.log('Imóvel criado, ID:', response.id);

        // Verifica se o usuário selecionou fotos
        if (this.selectedFiles.length > 0) {
          // PASSO 2: Fazer upload das fotos usando o ID retornado
          this.fazerUploadDasFotos(response.id);
        } else {
          // Se não tiver fotos, finaliza aqui
          this.finalizarCadastro();
        }
      },
      error: (err) => {
        console.error('Erro ao salvar dados:', err);
        alert('Erro ao salvar informações do imóvel.');
        this.isLoading = false;
      }
    });
  }

  // Método auxiliar para organizar o código
  fazerUploadDasFotos(imovelId: number) {
    this.propertyService.uploadFotos(imovelId, this.selectedFiles).subscribe({
      next: () => {
        console.log('Fotos enviadas com sucesso!');
        this.finalizarCadastro();
      },
      error: (err) => {
        console.error('Erro no upload das fotos:', err);
        // Aqui é interessante avisar que o imóvel foi salvo, mas as fotos falharam
        alert('Imóvel salvo, mas houve erro ao enviar as fotos. Tente editar o imóvel depois.');
        this.isLoading = false;
        this.router.navigate(['/']);
      }
    });
  }

  finalizarCadastro() {
    alert('Cadastro realizado com sucesso!');
    this.isLoading = false;
    this.router.navigate(['/']);
  }
}