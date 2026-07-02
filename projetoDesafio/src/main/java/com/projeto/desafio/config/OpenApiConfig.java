package com.projeto.desafio.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuração do OpenAPI 3.0 (Swagger) para documentação da API.
 */
@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name:Credit Engine}")
    private String applicationName;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(servers())
                .tags(tags());
    }

    private Info apiInfo() {
        return new Info()
                .title("Credit Engine API")
                .description("""
                    ## Plataforma de Cessão de Crédito Multimoedas
                    
                    API para precificação e liquidação de ativos (duplicatas, contratos, recebíveis) 
                    com suporte a múltiplas moedas (BRL e USD).
                    
                    ### Funcionalidades Principais:
                    - **Gestão de Câmbio**: Cadastro e consulta de taxas de câmbio
                    - **Motor de Precificação**: Cálculo de valor presente com Strategy Pattern
                    - **Liquidação de Transações**: Registro auditável com controle ACID
                    - **Relatórios Analíticos**: Extratos com filtros avançados
                    
                    ### Segurança e Precisão:
                    - Cálculos com precisão decimal (BigDecimal)
                    - Transações ACID com Optimistic Locking
                    - Auditoria completa de operações
                    """)
                .version("1.0.0")
                .contact(contact())
                .license(license());
    }

    private Contact contact() {
        return new Contact()
                .name("Time de Desenvolvimento")
                .email("dev@creditengine.com")
                .url("https://github.com/projeto-desafio");
    }

    private License license() {
        return new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");
    }

    private List<Server> servers() {
        return List.of(
                new Server()
                        .url("http://localhost:8080")
                        .description("Servidor de Desenvolvimento"),
                new Server()
                        .url("https://api.creditengine.com")
                        .description("Servidor de Produção")
        );
    }

    private List<Tag> tags() {
        return List.of(
                new Tag()
                        .name("Câmbio")
                        .description("Gestão de taxas de câmbio entre moedas"),
                new Tag()
                        .name("Precificação")
                        .description("Motor de cálculo de valor presente de recebíveis"),
                new Tag()
                        .name("Transações")
                        .description("Liquidação e gestão de transações de cessão"),
                new Tag()
                        .name("Relatórios")
                        .description("Extratos e consultas analíticas")
        );
    }
}

