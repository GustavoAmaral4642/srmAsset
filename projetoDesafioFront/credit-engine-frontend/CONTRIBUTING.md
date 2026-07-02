# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o **Credit Engine Frontend**! 

## 📋 Como Contribuir

### 1. Fork o Projeto

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/credit-engine-frontend.git
cd credit-engine-frontend

# Adicione o upstream
git remote add upstream https://github.com/original-repo/credit-engine-frontend.git
```

### 2. Crie uma Branch

```bash
# Atualize sua main
git checkout main
git pull upstream main

# Crie uma branch para sua feature
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-bugfix
```

### 3. Desenvolva

- Escreva código limpo e bem documentado
- Siga os padrões do projeto (veja abaixo)
- Adicione testes se aplicável
- Mantenha commits atômicos e descritivos

### 4. Commit

Use **Conventional Commits**:

```bash
# Features
git commit -m "feat: adiciona formulário de taxa de câmbio"

# Correções
git commit -m "fix: corrige validação de campo valor"

# Documentação
git commit -m "docs: atualiza README com instruções de deploy"

# Estilos
git commit -m "style: formata código com prettier"

# Refatoração
git commit -m "refactor: extrai lógica de validação para service"

# Testes
git commit -m "test: adiciona testes para PricingService"

# Chores
git commit -m "chore: atualiza dependências do Angular"
```

### 5. Push e Pull Request

```bash
# Push para seu fork
git push origin feature/minha-feature

# Abra um Pull Request no GitHub
# Descreva claramente o que foi feito e por quê
```

---

## 📐 Padrões de Código

### TypeScript

- Use **strict mode** (já configurado)
- Evite `any`, prefira tipos específicos
- Use interfaces para contratos
- Documente funções públicas com JSDoc

```typescript
/**
 * Calcula o valor presente de um recebível
 * @param faceValue Valor de face
 * @param rate Taxa total (base + spread)
 * @param termDays Prazo em dias
 * @returns Valor presente calculado
 */
calculatePresentValue(faceValue: number, rate: number, termDays: number): number {
  return faceValue / Math.pow(1 + rate, termDays / 30);
}
```

### Componentes

- Use **Standalone Components** (padrão Angular 17+)
- Prefira `OnPush` change detection
- Mantenha lógica de negócio nos services
- Use `@Input()` e `@Output()` para comunicação

```typescript
@Component({
  selector: 'app-exchange-rate-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './exchange-rate-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeRateFormComponent {
  @Input() initialData?: ExchangeRate;
  @Output() submitForm = new EventEmitter<ExchangeRateRequest>();
}
```

### Services

- Use `providedIn: 'root'` para singletons
- Retorne `Observable` ao invés de `Promise`
- Mantenha services focados (Single Responsibility)

```typescript
@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  constructor(private api: ApiService) {}

  getAll(): Observable<ExchangeRate[]> {
    return this.api.get<ExchangeRate[]>('/exchange-rates');
  }
}
```

### Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Component | kebab-case | `exchange-rate-form.component.ts` |
| Service | camelCase | `exchangeRate.service.ts` |
| Model | camelCase | `exchangeRate.model.ts` |
| Interface | PascalCase | `ExchangeRateResponse` |
| Enum | PascalCase | `TransactionStatus` |
| Const | UPPER_SNAKE_CASE | `API_BASE_URL` |

### Imports

Use os **path aliases** configurados:

```typescript
// ✅ Correto
import { ApiService } from '@core/services/api.service';
import { ExchangeRate } from '@features/currency/models/exchange-rate.model';

// ❌ Evitar
import { ApiService } from '../../../core/services/api.service';
```

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Com cobertura
ng test --code-coverage

# Watch mode
ng test --watch
```

### Escrever Testes

```typescript
describe('ExchangeRateService', () => {
  let service: ExchangeRateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ExchangeRateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch exchange rates', () => {
    const mockRates: ExchangeRate[] = [
      { id: 1, fromCurrency: 'USD', toCurrency: 'BRL', rate: 5.25 }
    ];

    service.getAll().subscribe(rates => {
      expect(rates).toEqual(mockRates);
    });

    const req = httpMock.expectOne('/api/exchange-rates');
    expect(req.request.method).toBe('GET');
    req.flush(mockRates);
  });
});
```

---

## 📝 Documentação

- Atualize o README se adicionar features importantes
- Documente novas etapas em `docs/etapaN/README.md`
- Use JSDoc para funções públicas complexas
- Adicione comentários explicativos em lógicas não-triviais

---

## 🐛 Reportar Bugs

Ao reportar um bug, inclua:

1. **Descrição clara** do problema
2. **Passos para reproduzir**
3. **Comportamento esperado** vs **comportamento atual**
4. **Screenshots** (se aplicável)
5. **Ambiente** (versão Angular, navegador, etc)

Use o template de issue no GitHub.

---

## 💡 Sugerir Features

Ao sugerir uma feature:

1. Explique o **problema** que ela resolve
2. Descreva a **solução proposta**
3. Liste **alternativas** consideradas
4. Adicione **contexto adicional** se necessário

---

## 📞 Dúvidas?

- Abra uma [Discussion](https://github.com/seu-usuario/credit-engine-frontend/discussions)
- Entre em contato por email: seu-email@example.com

---

**Obrigado por contribuir! 🚀**
