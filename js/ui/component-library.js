/**
 * Technical Components Library - Sprint 4
 * Provides pre-built cloud, database, server, and network components
 * Organized in collapsible categories with search functionality
 */

export class ComponentLibrary {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.searchInput = null;
        this.categories = this.initializeComponents();
        this.init();
    }

    /**
     * Initialize all available components organized by category
     */
    initializeComponents() {
        const awsBasePath = 'assets/aws/Architecture-Service-Icons_07312025';
        const azureBasePath = 'assets/azure';

        return {
            // ============ AWS CATEGORIES ============
            'AWS Compute': [
                { id: 'aws-ec2', name: 'EC2', icon: `${awsBasePath}/Arch_Compute/64/Arch_Amazon-EC2_64.svg`, color: '#FF9900', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-lambda', name: 'Lambda', icon: `${awsBasePath}/Arch_Compute/64/Arch_AWS-Lambda_64.svg`, color: '#FF9900', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-ecs', name: 'ECS', icon: `${awsBasePath}/Arch_Containers/64/Arch_Amazon-Elastic-Container-Service_64.svg`, color: '#FF9900', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-eks', name: 'EKS', icon: `${awsBasePath}/Arch_Containers/64/Arch_Amazon-Elastic-Kubernetes-Service_64.svg`, color: '#FF9900', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-fargate', name: 'Fargate', icon: `${awsBasePath}/Arch_Containers/64/Arch_AWS-Fargate_64.svg`, color: '#FF9900', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-batch', name: 'Batch', icon: `${awsBasePath}/Arch_Compute/64/Arch_AWS-Batch_64.svg`, color: '#FF9900', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-lightsail', name: 'Lightsail', icon: `${awsBasePath}/Arch_Compute/64/Arch_Amazon-Lightsail_64.svg`, color: '#FF9900', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-elastic-beanstalk', name: 'Elastic Beanstalk', icon: `${awsBasePath}/Arch_Compute/64/Arch_AWS-Elastic-Beanstalk_64.svg`, color: '#FF9900', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'AWS Storage': [
                { id: 'aws-s3', name: 'S3', icon: `${awsBasePath}/Arch_Storage/64/Arch_Amazon-Simple-Storage-Service_64.svg`, color: '#3F8624', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-ebs', name: 'EBS', icon: `${awsBasePath}/Arch_Storage/64/Arch_Amazon-Elastic-Block-Store_64.svg`, color: '#3F8624', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-efs', name: 'EFS', icon: `${awsBasePath}/Arch_Storage/64/Arch_Amazon-EFS_64.svg`, color: '#3F8624', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-glacier', name: 'S3 Glacier', icon: `${awsBasePath}/Arch_Storage/64/Arch_Amazon-Simple-Storage-Service-Glacier_64.svg`, color: '#3F8624', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-fsx', name: 'FSx', icon: `${awsBasePath}/Arch_Storage/64/Arch_Amazon-FSx_64.svg`, color: '#3F8624', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-backup', name: 'Backup', icon: `${awsBasePath}/Arch_Storage/64/Arch_AWS-Backup_64.svg`, color: '#3F8624', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'AWS Database': [
                { id: 'aws-rds', name: 'RDS', icon: `${awsBasePath}/Arch_Database/64/Arch_Amazon-RDS_64.svg`, color: '#527FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-dynamodb', name: 'DynamoDB', icon: `${awsBasePath}/Arch_Database/64/Arch_Amazon-DynamoDB_64.svg`, color: '#527FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-aurora', name: 'Aurora', icon: `${awsBasePath}/Arch_Database/64/Arch_Amazon-Aurora_64.svg`, color: '#527FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-elasticache', name: 'ElastiCache', icon: `${awsBasePath}/Arch_Database/64/Arch_Amazon-ElastiCache_64.svg`, color: '#527FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-neptune', name: 'Neptune', icon: `${awsBasePath}/Arch_Database/64/Arch_Amazon-Neptune_64.svg`, color: '#527FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-documentdb', name: 'DocumentDB', icon: `${awsBasePath}/Arch_Database/64/Arch_Amazon-DocumentDB_64.svg`, color: '#527FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-redshift', name: 'Redshift', icon: `${awsBasePath}/Arch_Analytics/64/Arch_Amazon-Redshift_64.svg`, color: '#527FFF', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'AWS Networking': [
                { id: 'aws-vpc', name: 'VPC', icon: `${awsBasePath}/Arch_Networking-Content-Delivery/64/Arch_Amazon-Virtual-Private-Cloud_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-cloudfront', name: 'CloudFront', icon: `${awsBasePath}/Arch_Networking-Content-Delivery/64/Arch_Amazon-CloudFront_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-route53', name: 'Route 53', icon: `${awsBasePath}/Arch_Networking-Content-Delivery/64/Arch_Amazon-Route-53_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-api-gateway', name: 'API Gateway', icon: `${awsBasePath}/Arch_Networking-Content-Delivery/64/Arch_Amazon-API-Gateway_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-elb', name: 'Load Balancer', icon: `${awsBasePath}/Arch_Networking-Content-Delivery/64/Arch_Elastic-Load-Balancing_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-direct-connect', name: 'Direct Connect', icon: `${awsBasePath}/Arch_Networking-Content-Delivery/64/Arch_AWS-Direct-Connect_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'AWS AI/ML': [
                { id: 'aws-sagemaker', name: 'SageMaker', icon: `${awsBasePath}/Arch_Artificial-Intelligence/64/Arch_Amazon-SageMaker-AI_64.svg`, color: '#01A88D', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-bedrock', name: 'Bedrock', icon: `${awsBasePath}/Arch_Artificial-Intelligence/64/Arch_Amazon-Bedrock_64.svg`, color: '#01A88D', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-lex', name: 'Lex', icon: `${awsBasePath}/Arch_Artificial-Intelligence/64/Arch_Amazon-Lex_64.svg`, color: '#01A88D', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-polly', name: 'Polly', icon: `${awsBasePath}/Arch_Artificial-Intelligence/64/Arch_Amazon-Polly_64.svg`, color: '#01A88D', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-rekognition', name: 'Rekognition', icon: `${awsBasePath}/Arch_Artificial-Intelligence/64/Arch_Amazon-Rekognition_64.svg`, color: '#01A88D', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-comprehend', name: 'Comprehend', icon: `${awsBasePath}/Arch_Artificial-Intelligence/64/Arch_Amazon-Comprehend_64.svg`, color: '#01A88D', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-textract', name: 'Textract', icon: `${awsBasePath}/Arch_Artificial-Intelligence/64/Arch_Amazon-Textract_64.svg`, color: '#01A88D', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-transcribe', name: 'Transcribe', icon: `${awsBasePath}/Arch_Artificial-Intelligence/64/Arch_Amazon-Transcribe_64.svg`, color: '#01A88D', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'AWS Analytics': [
                { id: 'aws-athena', name: 'Athena', icon: `${awsBasePath}/Arch_Analytics/64/Arch_Amazon-Athena_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-kinesis', name: 'Kinesis', icon: `${awsBasePath}/Arch_Analytics/64/Arch_Amazon-Kinesis_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-emr', name: 'EMR', icon: `${awsBasePath}/Arch_Analytics/64/Arch_Amazon-EMR_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-quicksight', name: 'QuickSight', icon: `${awsBasePath}/Arch_Analytics/64/Arch_Amazon-QuickSight_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-glue', name: 'Glue', icon: `${awsBasePath}/Arch_Analytics/64/Arch_AWS-Glue_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-msk', name: 'MSK (Kafka)', icon: `${awsBasePath}/Arch_Analytics/64/Arch_Amazon-Managed-Streaming-for-Apache-Kafka_64.svg`, color: '#8C4FFF', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'AWS Integration': [
                { id: 'aws-sns', name: 'SNS', icon: `${awsBasePath}/Arch_App-Integration/64/Arch_Amazon-Simple-Notification-Service_64.svg`, color: '#E7157B', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-sqs', name: 'SQS', icon: `${awsBasePath}/Arch_App-Integration/64/Arch_Amazon-Simple-Queue-Service_64.svg`, color: '#E7157B', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-eventbridge', name: 'EventBridge', icon: `${awsBasePath}/Arch_App-Integration/64/Arch_Amazon-EventBridge_64.svg`, color: '#E7157B', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-step-functions', name: 'Step Functions', icon: `${awsBasePath}/Arch_App-Integration/64/Arch_AWS-Step-Functions_64.svg`, color: '#E7157B', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-appsync', name: 'AppSync', icon: `${awsBasePath}/Arch_App-Integration/64/Arch_AWS-AppSync_64.svg`, color: '#E7157B', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-mq', name: 'MQ', icon: `${awsBasePath}/Arch_App-Integration/64/Arch_Amazon-MQ_64.svg`, color: '#E7157B', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'AWS Security': [
                { id: 'aws-iam', name: 'IAM', icon: `${awsBasePath}/Arch_Security-Identity-Compliance/64/Arch_AWS-Identity-and-Access-Management_64.svg`, color: '#DD344C', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-cognito', name: 'Cognito', icon: `${awsBasePath}/Arch_Security-Identity-Compliance/64/Arch_Amazon-Cognito_64.svg`, color: '#DD344C', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-kms', name: 'KMS', icon: `${awsBasePath}/Arch_Security-Identity-Compliance/64/Arch_AWS-Key-Management-Service_64.svg`, color: '#DD344C', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-secrets-manager', name: 'Secrets Manager', icon: `${awsBasePath}/Arch_Security-Identity-Compliance/64/Arch_AWS-Secrets-Manager_64.svg`, color: '#DD344C', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-waf', name: 'WAF', icon: `${awsBasePath}/Arch_Security-Identity-Compliance/64/Arch_AWS-WAF_64.svg`, color: '#DD344C', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'aws-shield', name: 'Shield', icon: `${awsBasePath}/Arch_Security-Identity-Compliance/64/Arch_AWS-Shield_64.svg`, color: '#DD344C', shape: 'rect', width: 80, height: 60, useImage: true },
            ],

            // ============ AZURE CATEGORIES ============
            'Azure Compute': [
                { id: 'azure-vm', name: 'Virtual Machine', icon: `${azureBasePath}/compute/10021-icon-service-Virtual-Machine.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-functions', name: 'Functions', icon: `${azureBasePath}/compute/10029-icon-service-Function-Apps.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-app-service', name: 'App Service', icon: `${azureBasePath}/appservices/10035-icon-service-App-Services.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-aks', name: 'AKS', icon: `${azureBasePath}/containers/10023-icon-service-Kubernetes-Services.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-container-instances', name: 'Container Instances', icon: `${azureBasePath}/containers/10104-icon-service-Container-Instances.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-batch', name: 'Batch', icon: `${azureBasePath}/containers/10031-icon-service-Batch-Accounts.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'Azure Storage': [
                { id: 'azure-storage', name: 'Storage Account', icon: `${azureBasePath}/storage/10086-icon-service-Storage-Accounts.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-blob', name: 'Blob Storage', icon: `${azureBasePath}/general/10780-icon-service-Blob-Block.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-files', name: 'File Share', icon: `${azureBasePath}/storage/10400-icon-service-Azure-Fileshares.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-netapp', name: 'NetApp Files', icon: `${azureBasePath}/storage/10096-icon-service-Azure-NetApp-Files.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-disk', name: 'Managed Disks', icon: `${azureBasePath}/compute/10032-icon-service-Disks.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-data-lake', name: 'Data Lake', icon: `${azureBasePath}/storage/10090-icon-service-Data-Lake-Storage-Gen1.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'Azure Database': [
                { id: 'azure-sql', name: 'SQL Database', icon: `${azureBasePath}/databases/10130-icon-service-SQL-Database.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-cosmos', name: 'Cosmos DB', icon: `${azureBasePath}/databases/10121-icon-service-Azure-Cosmos-DB.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-mysql', name: 'MySQL', icon: `${azureBasePath}/databases/10122-icon-service-Azure-Database-MySQL-Server.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-postgresql', name: 'PostgreSQL', icon: `${azureBasePath}/databases/10131-icon-service-Azure-Database-PostgreSQL-Server.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-redis', name: 'Redis Cache', icon: `${azureBasePath}/databases/10137-icon-service-Cache-Redis.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-sql-managed', name: 'SQL Managed', icon: `${azureBasePath}/databases/10136-icon-service-SQL-Managed-Instance.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'Azure Networking': [
                { id: 'azure-vnet', name: 'Virtual Network', icon: `${azureBasePath}/networking/10061-icon-service-Virtual-Networks.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-lb', name: 'Load Balancer', icon: `${azureBasePath}/networking/10062-icon-service-Load-Balancers.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-app-gateway', name: 'App Gateway', icon: `${azureBasePath}/networking/10076-icon-service-Application-Gateways.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-cdn', name: 'CDN', icon: `${azureBasePath}/appservices/00056-icon-service-CDN-Profiles.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-dns', name: 'DNS Zones', icon: `${azureBasePath}/networking/10064-icon-service-DNS-Zones.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-firewall', name: 'Firewall', icon: `${azureBasePath}/networking/10084-icon-service-Firewalls.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-front-door', name: 'Front Door', icon: `${azureBasePath}/networking/10073-icon-service-Front-Door-and-CDN-Profiles.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'Azure AI/ML': [
                { id: 'azure-ml', name: 'Machine Learning', icon: `${azureBasePath}/aimachinelearning/10166-icon-service-Machine-Learning.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-openai', name: 'OpenAI', icon: `${azureBasePath}/aimachinelearning/03438-icon-service-Azure-OpenAI.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-cognitive', name: 'Cognitive Services', icon: `${azureBasePath}/aimachinelearning/10162-icon-service-Cognitive-Services.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-bot', name: 'Bot Service', icon: `${azureBasePath}/aimachinelearning/10165-icon-service-Bot-Services.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-search', name: 'Cognitive Search', icon: `${azureBasePath}/aimachinelearning/10044-icon-service-Cognitive-Search.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-ai-studio', name: 'AI Studio', icon: `${azureBasePath}/aimachinelearning/03513-icon-service-AI-Studio.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-speech', name: 'Speech Services', icon: `${azureBasePath}/aimachinelearning/00797-icon-service-Speech-Services.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'Azure Analytics': [
                { id: 'azure-synapse', name: 'Synapse', icon: `${azureBasePath}/analytics/00606-icon-service-Azure-Synapse-Analytics.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-data-factory', name: 'Data Factory', icon: `${azureBasePath}/analytics/10126-icon-service-Data-Factories.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-databricks', name: 'Databricks', icon: `${azureBasePath}/analytics/10787-icon-service-Azure-Databricks.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-event-hub', name: 'Event Hubs', icon: `${azureBasePath}/analytics/00039-icon-service-Event-Hubs.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-stream-analytics', name: 'Stream Analytics', icon: `${azureBasePath}/analytics/00042-icon-service-Stream-Analytics-Jobs.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-hdinsight', name: 'HDInsight', icon: `${azureBasePath}/analytics/10142-icon-service-HD-Insight-Clusters.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'Azure Security': [
                { id: 'azure-ad', name: 'Entra ID', icon: `${azureBasePath}/identity/10222-icon-service-Entra-Domain-Services.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-key-vault', name: 'Key Vault', icon: `${azureBasePath}/security/10245-icon-service-Key-Vaults.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-sentinel', name: 'Sentinel', icon: `${azureBasePath}/security/10248-icon-service-Azure-Sentinel.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-defender', name: 'Defender', icon: `${azureBasePath}/security/10241-icon-service-Microsoft-Defender-for-Cloud.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-mfa', name: 'MFA', icon: `${azureBasePath}/identity/03256-icon-service-Multi-Factor-Authentication.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
            ],
            'Azure DevOps': [
                { id: 'azure-devops', name: 'Azure DevOps', icon: `${azureBasePath}/devops/10261-icon-service-Azure-DevOps.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-devtest', name: 'DevTest Labs', icon: `${azureBasePath}/devops/10264-icon-service-DevTest-Labs.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-api-mgmt', name: 'API Management', icon: `${azureBasePath}/devops/10042-icon-service-API-Management-Services.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-app-insights', name: 'App Insights', icon: `${azureBasePath}/devops/00012-icon-service-Application-Insights.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
                { id: 'azure-load-testing', name: 'Load Testing', icon: `${azureBasePath}/devops/02423-icon-service-Load-Testing.svg`, color: '#0078D4', shape: 'rect', width: 80, height: 60, useImage: true },
            ],

            // ============ GENERAL CATEGORIES ============
            'Databases': [
                { id: 'db-mysql', name: 'MySQL', icon: '🐬', color: '#00758F', shape: 'cylinder', width: 80, height: 60 },
                { id: 'db-postgresql', name: 'PostgreSQL', icon: '🐘', color: '#336791', shape: 'cylinder', width: 80, height: 60 },
                { id: 'db-mongodb', name: 'MongoDB', icon: '🍃', color: '#47A248', shape: 'cylinder', width: 80, height: 60 },
                { id: 'db-redis', name: 'Redis', icon: '⚡', color: '#DC382D', shape: 'cylinder', width: 80, height: 60 },
                { id: 'db-cassandra', name: 'Cassandra', icon: '💫', color: '#1287B1', shape: 'cylinder', width: 80, height: 60 },
                { id: 'db-elasticsearch', name: 'Elasticsearch', icon: '🔍', color: '#005571', shape: 'cylinder', width: 80, height: 60 },
            ],
            'Servers': [
                { id: 'server-web', name: 'Web Server', icon: '🌐', color: '#2ecc71', shape: 'rect', width: 80, height: 60 },
                { id: 'server-app', name: 'App Server', icon: '📱', color: '#3498db', shape: 'rect', width: 80, height: 60 },
                { id: 'server-api', name: 'API Server', icon: '🔌', color: '#9b59b6', shape: 'rect', width: 80, height: 60 },
                { id: 'server-mail', name: 'Mail Server', icon: '📧', color: '#e74c3c', shape: 'rect', width: 80, height: 60 },
                { id: 'server-cache', name: 'Cache Server', icon: '⚡', color: '#f39c12', shape: 'rect', width: 80, height: 60 },
                { id: 'server-proxy', name: 'Proxy Server', icon: '🔒', color: '#34495e', shape: 'rect', width: 80, height: 60 },
            ],
            'Network': [
                { id: 'net-router', name: 'Router', icon: '📡', color: '#16a085', shape: 'diamond', width: 80, height: 60 },
                { id: 'net-firewall', name: 'Firewall', icon: '🛡️', color: '#c0392b', shape: 'diamond', width: 80, height: 60 },
                { id: 'net-load-balancer', name: 'Load Balancer', icon: '⚖️', color: '#27ae60', shape: 'diamond', width: 80, height: 60 },
                { id: 'net-vpn', name: 'VPN', icon: '🔐', color: '#8e44ad', shape: 'diamond', width: 80, height: 60 },
                { id: 'net-cdn', name: 'CDN', icon: '🌍', color: '#2980b9', shape: 'diamond', width: 80, height: 60 },
                { id: 'net-dns', name: 'DNS', icon: '🔍', color: '#d35400', shape: 'diamond', width: 80, height: 60 },
            ],
            'Users & Devices': [
                { id: 'user-single', name: 'User', icon: '👤', color: '#95a5a6', shape: 'circle', width: 60, height: 60 },
                { id: 'user-group', name: 'User Group', icon: '👥', color: '#7f8c8d', shape: 'circle', width: 60, height: 60 },
                { id: 'device-mobile', name: 'Mobile', icon: '📱', color: '#3498db', shape: 'rect', width: 50, height: 70 },
                { id: 'device-desktop', name: 'Desktop', icon: '🖥️', color: '#2c3e50', shape: 'rect', width: 80, height: 60 },
                { id: 'device-tablet', name: 'Tablet', icon: '📲', color: '#34495e', shape: 'rect', width: 70, height: 70 },
                { id: 'device-iot', name: 'IoT Device', icon: '📟', color: '#16a085', shape: 'circle', width: 60, height: 60 },
            ]
        };
    }

    /**
     * Initialize the component library UI
     */
    init() {
        this.container = document.getElementById('components-library');
        if (!this.container) {
            console.error('Components library container not found');
            return;
        }

        this.render();
        this.attachEventListeners();
    }

    /**
     * Render the entire library UI
     */
    render() {
        this.container.innerHTML = `
            <div class="library-header">
                <h3>Componentes</h3>
                <input
                    type="text"
                    class="library-search"
                    placeholder="Buscar componente..."
                    id="component-search"
                />
            </div>
            <div class="library-categories" id="library-categories">
                ${this.renderCategories()}
            </div>
        `;

        this.searchInput = this.container.querySelector('#component-search');

        // Collapse all categories, then expand only the first one
        setTimeout(() => {
            const allCategories = this.container.querySelectorAll('[data-components]');
            allCategories.forEach((categoryEl, index) => {
                if (index === 0) {
                    // First category open
                    categoryEl.style.display = 'grid';
                    const header = categoryEl.previousElementSibling;
                    if (header) {
                        header.classList.add('expanded');
                        const icon = header.querySelector('.category-icon');
                        if (icon) icon.textContent = '▼';
                    }
                } else {
                    // Rest collapsed
                    categoryEl.style.display = 'none';
                    const header = categoryEl.previousElementSibling;
                    if (header) {
                        header.classList.remove('expanded');
                        const icon = header.querySelector('.category-icon');
                        if (icon) icon.textContent = '▶';
                    }
                }
            });
        }, 0);
    }

    /**
     * Render all categories and their components
     */
    renderCategories() {
        return Object.entries(this.categories).map(([categoryName, components]) => {
            return `
                <div class="library-category" data-category="${categoryName}">
                    <div class="category-header" data-toggle="${categoryName}">
                        <span class="category-icon">▼</span>
                        <span class="category-name">${categoryName}</span>
                        <span class="category-count">${components.length}</span>
                    </div>
                    <div class="category-components" data-components="${categoryName}">
                        ${components.map(comp => this.renderComponent(comp)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Render a single component item
     */
    renderComponent(component) {
        const iconContent = component.useImage 
            ? `<img src="${component.icon}" alt="${component.name}" style="width: 36px; height: 36px; object-fit: contain;" />`
            : component.icon;
        
        return `
            <div class="component-item" 
                 data-component-id="${component.id}"
                 draggable="true"
                 title="${component.name}">
                <div class="component-icon" style="background-color: ${component.color}20; color: ${component.color}">
                    ${iconContent}
                </div>
                <div class="component-name">${component.name}</div>
            </div>
        `;
    }

    /**
     * Attach event listeners for interactions
     */
    attachEventListeners() {
        // Category toggle
        this.container.querySelectorAll('[data-toggle]').forEach(header => {
            header.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.toggle;
                this.toggleCategory(category);
            });
        });

        // Component drag start
        this.container.querySelectorAll('.component-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                const componentId = e.currentTarget.dataset.componentId;
                e.dataTransfer.setData('component-id', componentId);
                e.dataTransfer.effectAllowed = 'copy';
            });

            // Click to add to center
            item.addEventListener('click', (e) => {
                const componentId = e.currentTarget.dataset.componentId;
                this.addComponentToCanvas(componentId);
            });
        });

        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterComponents(e.target.value);
            });
        }

        // Canvas drop handler
        const canvasWrapper = document.getElementById('canvas-wrapper');
        if (canvasWrapper) {
            canvasWrapper.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            });

            canvasWrapper.addEventListener('drop', (e) => {
                e.preventDefault();
                const componentId = e.dataTransfer.getData('component-id');
                if (componentId) {
                    const rect = canvasWrapper.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    this.addComponentToCanvas(componentId, x, y);
                }
            });
        }
    }

    /**
     * Toggle category open/closed (accordion behavior - only one open at a time)
     */
    toggleCategory(categoryName) {
        const categoryEl = this.container.querySelector(`[data-category="${categoryName}"]`);
        if (!categoryEl) return;

        const componentsEl = categoryEl.querySelector(`[data-components="${categoryName}"]`);
        const headerEl = categoryEl.querySelector('.category-header');
        const iconEl = categoryEl.querySelector('.category-icon');

        // Check if it's currently open
        const isOpen = componentsEl.style.display === '' || componentsEl.style.display === 'grid';

        // If opening this category, close all others first (accordion behavior)
        if (!isOpen) {
            this.container.querySelectorAll('.library-category').forEach(cat => {
                const otherComponents = cat.querySelector('[data-components]');
                const otherHeader = cat.querySelector('.category-header');
                const otherIcon = cat.querySelector('.category-icon');
                if (otherComponents && otherComponents !== componentsEl) {
                    otherComponents.style.display = 'none';
                    if (otherHeader) otherHeader.classList.remove('expanded');
                    if (otherIcon) otherIcon.textContent = '▶';
                }
            });
        }

        // Toggle current category
        componentsEl.style.display = isOpen ? 'none' : 'grid';
        iconEl.textContent = isOpen ? '▶' : '▼';
        if (headerEl) {
            headerEl.classList.toggle('expanded', !isOpen);
        }
    }

    /**
     * Filter components by search query
     */
    filterComponents(query) {
        const lowerQuery = query.toLowerCase();
        
        Object.entries(this.categories).forEach(([categoryName, components]) => {
            const categoryEl = this.container.querySelector(`[data-category="${categoryName}"]`);
            if (!categoryEl) return;

            const matchingComponents = components.filter(comp => 
                comp.name.toLowerCase().includes(lowerQuery) ||
                comp.id.toLowerCase().includes(lowerQuery)
            );

            if (matchingComponents.length === 0 && query) {
                categoryEl.style.display = 'none';
            } else {
                categoryEl.style.display = 'block';
                
                // Show/hide individual components
                const componentEls = categoryEl.querySelectorAll('.component-item');
                componentEls.forEach(el => {
                    const compId = el.dataset.componentId;
                    const comp = components.find(c => c.id === compId);
                    if (comp) {
                        const matches = comp.name.toLowerCase().includes(lowerQuery) ||
                                      comp.id.toLowerCase().includes(lowerQuery);
                        el.style.display = matches || !query ? 'flex' : 'none';
                    }
                });
            }
        });
    }

    /**
     * Add a component to the canvas
     */
    addComponentToCanvas(componentId, x = null, y = null) {
        // Find component definition
        let component = null;
        for (const components of Object.values(this.categories)) {
            component = components.find(c => c.id === componentId);
            if (component) break;
        }

        if (!component) return;

        // Get canvas manager
        const canvasManager = this.app.canvasManager;
        const stage = canvasManager.stage;
        const layer = canvasManager.mainLayer;

        // Calculate position
        if (x === null || y === null) {
            const stageSize = stage.size();
            const scale = stage.scaleX();
            const position = stage.position();
            
            x = (stageSize.width / 2 - position.x) / scale;
            y = (stageSize.height / 2 - position.y) / scale;
        } else {
            // Convert screen coordinates to canvas coordinates
            const scale = stage.scaleX();
            const position = stage.position();
            x = (x - position.x) / scale;
            y = (y - position.y) / scale;
        }

        // Create the shape based on component type
        let shape;
        
        // If component uses image, create Konva.Image instead of regular shape
        if (component.useImage) {
            const imageObj = new Image();
            imageObj.onload = () => {
                shape = new Konva.Image({
                    x: x - component.width / 2,
                    y: y - component.height / 2,
                    image: imageObj,
                    width: component.width,
                    height: component.height,
                    draggable: true,
                    name: 'shape'
                });
                
                // Add text label
                const text = new Konva.Text({
                    x: x - component.width,
                    y: y + component.height / 2 + 5,
                    text: component.name,
                    fontSize: 12,
                    fontFamily: 'Arial',
                    fill: '#2c3e50',
                    align: 'center',
                    width: component.width * 2
                });
                
                // Add to canvas
                canvasManager.addShape(shape, true);
                layer.add(text);
                
                // Link text to shape for movement
                shape.on('dragmove', () => {
                    text.position({
                        x: shape.x() + shape.width() / 2 - component.width,
                        y: shape.y() + shape.height() + 5
                    });
                });
                
                // Save history
                canvasManager.saveHistory(`Añadido ${component.name}`);
                layer.draw();
                
                // Notify user
                if (this.app.notify) {
                    const notification = this.app.notify(`${component.name} añadido al canvas`);
                    if (notification && typeof notification.catch === 'function') {
                        notification.catch(() => {});
                    }
                }
            };
            imageObj.src = component.icon;
            return; // Exit early since image loading is async
        }
        
        const commonAttrs = {
            x, y,
            fill: component.color,
            stroke: '#000',
            strokeWidth: 2,
            draggable: true,
            name: 'shape'
        };

        switch (component.shape) {
            case 'rect':
                shape = new Konva.Rect({
                    ...commonAttrs,
                    width: component.width,
                    height: component.height,
                    cornerRadius: 8,
                    name: 'shape'
                });
                break;
            
            case 'circle':
                shape = new Konva.Circle({
                    ...commonAttrs,
                    radius: component.width / 2,
                });
                break;
            
            case 'diamond':
                // Diamond shape using Konva.Line with closed points
                const halfW = component.width / 2;
                const halfH = component.height / 2;
                shape = new Konva.Line({
                    ...commonAttrs,
                    points: [0, -halfH, halfW, 0, 0, halfH, -halfW, 0],
                    closed: true
                });
                break;
            
            case 'cylinder':
                // Create a group for cylinder (ellipse top + rect body)
                const cylinderW = component.width;
                const cylinderH = component.height;
                const ellipseH = cylinderH * 0.15;
                
                const body = new Konva.Rect({
                    x: x - cylinderW / 2,
                    y: y - cylinderH / 2 + ellipseH / 2,
                    width: cylinderW,
                    height: cylinderH - ellipseH,
                    fill: component.color,
                    stroke: '#000',
                    strokeWidth: 2
                });
                
                const topEllipse = new Konva.Ellipse({
                    x: x,
                    y: y - cylinderH / 2 + ellipseH,
                    radiusX: cylinderW / 2,
                    radiusY: ellipseH,
                    fill: component.color,
                    stroke: '#000',
                    strokeWidth: 2
                });
                
                const bottomEllipse = new Konva.Ellipse({
                    x: x,
                    y: y + cylinderH / 2 - ellipseH / 2,
                    radiusX: cylinderW / 2,
                    radiusY: ellipseH,
                    fill: component.color,
                    stroke: '#000',
                    strokeWidth: 2
                });
                
                // Use body as the main shape and add others to layer separately
                shape = body;
                layer.add(topEllipse);
                layer.add(bottomEllipse);
                layer.add(body);
                
                // Store references for cleanup
                shape.setAttr('_cylinderParts', [topEllipse, bottomEllipse]);
                
                break;
            
            default:
                shape = new Konva.Rect({
                    ...commonAttrs,
                    width: component.width,
                    height: component.height
                });
        }

        // Add text label
        const shapeX = shape.x ? shape.x() : x;
        const shapeY = shape.y ? shape.y() : y;
        const text = new Konva.Text({
            x: shapeX - (component.width / 2),
            y: shapeY + (component.height || 60) / 2 + 5,
            text: component.name,
            fontSize: 12,
            fontFamily: 'Arial',
            fill: '#2c3e50',
            align: 'center',
            width: component.width * 2
        });

        // Add to canvas using addShape for proper initialization
        canvasManager.addShape(shape, true);
        layer.add(text);
        
        // Link text to shape for movement
        shape.on('dragmove', () => {
            text.position({
                x: shape.x() - (component.width / 2),
                y: shape.y() + (component.height || 60) / 2 + 5
            });
            
            // Move cylinder parts if they exist
            const cylinderParts = shape.getAttr('_cylinderParts');
            if (cylinderParts) {
                const [topEllipse, bottomEllipse] = cylinderParts;
                const cylinderH = component.height;
                const ellipseH = cylinderH * 0.15;
                
                topEllipse.position({
                    x: shape.x(),
                    y: shape.y() - cylinderH / 2 + ellipseH
                });
                
                bottomEllipse.position({
                    x: shape.x(),
                    y: shape.y() + cylinderH / 2 - ellipseH / 2
                });
            }
        });

        // Save to history
        canvasManager.saveHistory(`Añadido ${component.name}`);
        layer.draw();

        // Notify user
        if (this.app.notify) {
            this.app.notify(`${component.name} añadido al canvas`).catch(() => {});
        }
    }
}
