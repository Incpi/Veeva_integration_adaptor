# Veeva Custom SAP CPI Adaptor

## Benefits

- The Veeva Custom SAP CPI Adaptor enables faster and more reliable integration between Veeva CRM and SAP ERP, reducing the need for manual authentication and ensuring data accuracy and consistency across the systems.
- The adaptor supports various business scenarios that are common in the life sciences industry, such as managing orders, inventory, pricing, billing, and customer master data. This helps to streamline the business processes and improve customer satisfaction and loyalty.
- The adaptor leverages the SAP Cloud Platform Integration service, which is a cloud-based solution that offers high scalability, security, and performance. The adaptor also provides a user-friendly interface for configuring and monitoring the integration processes, allowing for easy troubleshooting and maintenance.

## Installation

- To install the Veeva Custom SAP CPI Adaptor, you need to have access to the SAP Cloud Platform Integration tenant and the Veeva CRM system. You also need to download the adaptor package (.esa file in github) and import it into your CPI tenant.
- After importing the adaptor package, you need to configure the connection parameters for Veeva CRM and SAP ERP, such as the endpoint URLs, authentication credentials, and message mapping rules. You can use the provided configuration guide for more details on how to set up the adaptor.
- Once the configuration is done, you can activate the integration flows for the business scenarios that you want to enable. You can also use the monitoring dashboard to view the status and logs of the integration processes.
- VQL stands for Veeva Query Language, which is a SQL-like language that allows you to query data from Veeva CRM. The adaptor uses VQL to fetch metadata from Veeva CRM and post it to other downstream systems.

## limitations
 - as of v1.0.0 it's only fetch data (via POST reqest to authenticate) from veeva. Updates on veeva (attempt on your risk) might not reflect the desired operation.

## Features & Development 
- V1.0.0
  - veeva authenticate  (Basic Auth Supported as of now with SAP CPI sequrity matrial to store it securely) and process execute next call for query (VQL) 
