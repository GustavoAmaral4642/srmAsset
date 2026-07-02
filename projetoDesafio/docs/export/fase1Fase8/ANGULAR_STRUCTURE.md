# 📁 Estrutura Sugerida para Angular

> Organização de pastas recomendada para o frontend do Credit Engine

---

## 🏗️ Estrutura de Pastas

```
credit-engine-frontend/
│
├── src/
│   ├── app/
│   │   │
│   │   ├── core/                         # Singleton services, guards, interceptors
│   │   │   ├── interceptors/
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── services/
│   │   │   │   └── api.service.ts        # Base HTTP service
│   │   │   └── core.module.ts
│   │   │
│   │   ├── shared/                       # Componentes/pipes/directives reutilizáveis
│   │   │   ├── components/
│   │   │   │   ├── loading-spinner/
│   │   │   │   ├── confirm-dialog/
│   │   │   │   ├── error-message/
│   │   │   │   └── pagination/
│   │   │   ├── models/
│   │   │   │   ├── api-error.model.ts
│   │   │   │   ├── page.model.ts
│   │   │   │   └── currency.model.ts
│   │   │   ├── pipes/
│   │   │   │   ├── currency-format.pipe.ts
│   │   │   │   └── percent-format.pipe.ts
│   │   │   ├── directives/
│   │   │   │   └── decimal-input.directive.ts
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── features/                     # Módulos de funcionalidade (lazy loaded)
│   │   │   │
│   │   │   ├── currency/                 # 💱 Domínio: Câmbio
│   │   │   │   ├── components/
│   │   │   │   │   ├── exchange-rate-form/
│   │   │   │   │   └── exchange-rate-list/
│   │   │   │   ├── pages/
│   │   │   │   │   └── currency-page/
│   │   │   │   ├── services/
│   │   │   │   │   └── exchange-rate.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   └── exchange-rate.model.ts
│   │   │   │   ├── currency-routing.module.ts
│   │   │   │   └── currency.module.ts
│   │   │   │
│   │   │   ├── pricing/                  # 📊 Domínio: Precificação
│   │   │   │   ├── components/
│   │   │   │   │   ├── pricing-form/
│   │   │   │   │   ├── pricing-result/
│   │   │   │   │   └── receivable-type-select/
│   │   │   │   ├── pages/
│   │   │   │   │   └── pricing-simulator-page/
│   │   │   │   ├── services/
│   │   │   │   │   └── pricing.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   └── pricing.model.ts
│   │   │   │   ├── pricing-routing.module.ts
│   │   │   │   └── pricing.module.ts
│   │   │   │
│   │   │   ├── transaction/              # 💳 Domínio: Transações
│   │   │   │   ├── components/
│   │   │   │   │   ├── transaction-form/
│   │   │   │   │   ├── transaction-table/
│   │   │   │   │   ├── transaction-detail/
│   │   │   │   │   └── transaction-filters/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── transaction-list-page/
│   │   │   │   │   └── transaction-detail-page/
│   │   │   │   ├── services/
│   │   │   │   │   └── transaction.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   └── transaction.model.ts
│   │   │   │   ├── transaction-routing.module.ts
│   │   │   │   └── transaction.module.ts
│   │   │   │
│   │   │   └── report/                   # 📈 Domínio: Relatórios
│   │   │       ├── components/
│   │   │       │   ├── settlement-extract-table/
│   │   │       │   └── report-filters/
│   │   │       ├── pages/
│   │   │       │   └── settlement-extract-page/
│   │   │       ├── services/
│   │   │       │   └── report.service.ts
│   │   │       ├── report-routing.module.ts
│   │   │       └── report.module.ts
│   │   │
│   │   ├── layout/                       # Layout components
│   │   │   ├── header/
│   │   │   ├── sidebar/
│   │   │   ├── footer/
│   │   │   └── main-layout/
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.config.ts                 # ou app.module.ts
│   │   └── app.routes.ts
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   └── styles/
│       ├── _variables.scss
│       ├── _mixins.scss
│       └── styles.scss
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📋 Rotas Sugeridas

```typescript
// src/app/app.routes.ts

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pricing',
    pathMatch: 'full'
  },
  {
    path: 'pricing',
    loadChildren: () => import('./features/pricing/pricing.module')
      .then(m => m.PricingModule),
    data: { title: 'Simulador de Precificação' }
  },
  {
    path: 'transactions',
    loadChildren: () => import('./features/transaction/transaction.module')
      .then(m => m.TransactionModule),
    data: { title: 'Transações' }
  },
  {
    path: 'currency',
    loadChildren: () => import('./features/currency/currency.module')
      .then(m => m.CurrencyModule),
    data: { title: 'Taxas de Câmbio' }
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/report/report.module')
      .then(m => m.ReportModule),
    data: { title: 'Relatórios' }
  },
  {
    path: '**',
    redirectTo: 'pricing'
  }
];
```

---

## 🎨 Telas Principais

### 1. Simulador de Precificação (`/pricing`)

**Componentes:**
- Formulário de simulação (valor, vencimento, tipo, moedas)
- Card de resultado em tempo real
- Gráfico de breakdown do cálculo (opcional)

**Estado:**
- Form reativo com validação
- Loading state durante requisição
- Resultado da última simulação

---

### 2. Grid de Transações (`/transactions`)

**Componentes:**
- Barra de filtros (status, cedente, moeda, período)
- Tabela paginada server-side
- Actions (ver detalhes, liquidar, cancelar)
- Dialog de confirmação para ações

**Estado:**
- Filtros ativos
- Página atual
- Itens selecionados (se bulk actions)

---

### 3. Detalhe de Transação (`/transactions/:id`)

**Componentes:**
- Card de informações principais
- Timeline de status
- Ações contextuais

---

### 4. Taxas de Câmbio (`/currency`)

**Componentes:**
- Lista de taxas vigentes
- Formulário para adicionar nova taxa
- Histórico de taxas

---

### 5. Extrato de Liquidações (`/reports/settlement-extract`)

**Componentes:**
- Filtros de período, cedente, moeda
- Tabela com dados agregados
- Export para CSV/Excel

---

## 🔧 Bibliotecas Recomendadas

| Categoria | Biblioteca | Motivo |
|-----------|------------|--------|
| **UI Components** | Angular Material ou PrimeNG | Componentes prontos |
| **Forms** | Reactive Forms (nativo) | Validação robusta |
| **State** | NgRx ou Signals (Angular 17+) | Estado complexo |
| **HTTP** | HttpClient (nativo) | Integração REST |
| **Tables** | AG Grid ou Material Table | Paginação server-side |
| **Charts** | ngx-charts ou Chart.js | Gráficos |
| **Date** | date-fns ou Day.js | Manipulação de datas |
| **Notifications** | ngx-toastr | Feedback ao usuário |
| **Loading** | ngx-spinner | Loading global |

---

## 💡 Convenções

### Nomenclatura

```
// Componentes: kebab-case com sufixo
exchange-rate-form.component.ts

// Serviços: camelCase com sufixo
exchangeRate.service.ts

// Modelos: camelCase com sufixo
exchangeRate.model.ts

// Módulos: kebab-case com sufixo
currency.module.ts
```

### Estrutura de Componente

```typescript
// feature-name.component.ts
@Component({
  selector: 'app-feature-name',
  templateUrl: './feature-name.component.html',
  styleUrls: ['./feature-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureNameComponent implements OnInit {
  // Inputs
  @Input() data: DataType;
  
  // Outputs
  @Output() actionClicked = new EventEmitter<void>();
  
  // Signals (Angular 17+)
  loading = signal(false);
  
  // Lifecycle
  ngOnInit(): void {}
}
```

---

## 🔜 Ordem de Implementação Sugerida

1. **Setup inicial**: Criar projeto, configurar environment, interceptor de erro
2. **Layout**: Header, sidebar, estrutura base
3. **Shared**: Models, pipes, componentes comuns
4. **Pricing**: Primeira feature funcional (simulador)
5. **Currency**: Gestão de taxas (dependência do pricing)
6. **Transaction**: CRUD completo com paginação
7. **Report**: Relatórios e exportação

