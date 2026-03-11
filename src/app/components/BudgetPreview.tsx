import { useRef } from "react";
import { Printer, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { BudgetData } from "./BudgetGenerator";

interface BudgetPreviewProps {
  budgetData: BudgetData | null;
}

export function BudgetPreview({ budgetData }: BudgetPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Orçamento</title>
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  color: #000;
                }
                .budget-container {
                  max-width: 800px;
                  margin: 0 auto;
                  border: 2px solid #000;
                  padding: 0;
                }
                .header {
                  display: flex;
                  border-bottom: 2px solid #000;
                }
                .header-left {
                  flex: 1;
                  padding: 20px;
                  border-right: 2px solid #000;
                  display: flex;
                  flexDirection: "column",
                  justifyContent: "center",
                }
                .company-name {
                  font-size: 48px;
                  font-weight: bold;
                  line-height: 1;
                  margin-bottom: 5px;
                }
                .company-subtitle {
                  font-size: 20px;
                  font-weight: bold;
                  margin-bottom: 15px;
                }
                .company-info {
                  font-size: 11px;
                  line-height: 1.4;
                }
                .header-right {
                  width: 200px;
                  display: flex;
                  flex-direction: column;
                }
                .budget-title {
                  padding: 15px;
                  text-align: center;
                  font-weight: bold;
                  font-size: 18px;
                  border-bottom: 2px solid #000;
                }
                .budget-date {
                  padding: 15px;
                  text-align: center;
                  font-size: 14px;
                  border-bottom: 2px solid #000;
                }
                .budget-number {
                  padding: 15px;
                  text-align: center;
                  font-size: 11px;
                }
                .content {
                  padding: 15px;
                }
                .client-info {
                  font-size: 12px;
                  line-height: 1.8;
                }
                .info-row {
                  display: flex;
                  border-bottom: 1px solid #000;
                  padding: 5px 0;
                }
                .info-label {
                  font-weight: normal;
                  margin-right: 5px;
                }
                .info-value {
                  flex: 1;
                  text-decoration: underline;
                }
                .info-grid {
                  display: grid;
                  grid-template-columns: 2fr 1fr 1fr;
                  gap: 10px;
                  margin-bottom: 10px;
                }
                .info-grid-item {
                  border-bottom: 1px solid #000;
                  padding: 5px 0;
                }
                .delivery-info {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px;
                  margin-bottom: 15px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 12px;
                }
                th {
                  border: 1px solid #000;
                  padding: 8px;
                  background-color: #fff;
                  font-weight: bold;
                  text-align: center;
                }
                td {
                  border: 1px solid #000;
                  padding: 8px;
                }
                .empty-row td {
                  height: 30px;
                }
                .validity-row td {
                  text-align: center;
                  font-weight: bold;
                }
                .total-row {
                  font-weight: bold;
                }
                .signature {
                  margin-top: 30px;
                  padding-top: 10px;
                  border-top: 1px solid #000;
                  font-size: 12px;
                }
                @media print {
                  body {
                    padding: 0;
                  }
                  .budget-container {
                    border: 2px solid #000;
                  }
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (!budgetData) {
    return (
      <Card className="shadow-lg h-full">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle>Pré-visualização</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-600 mb-2">Nenhum orçamento gerado</p>
            <p className="text-sm text-slate-500">
              Preencha os dados e clique em "Gerar Orçamento"
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = budgetData.items.reduce((sum, item) => sum + item.total, 0);
  
  // Add empty rows to match the template
  const emptyRowsCount = Math.max(0, 5 - budgetData.items.length);
  const emptyRows = Array.from({ length: emptyRowsCount }, (_, i) => i);

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-slate-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Pré-visualização</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div
          ref={printRef}
          className="bg-white"
          style={{
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              border: "2px solid #000",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                borderBottom: "2px solid #000",
              }}
            >
              {/* Left side - Company Info */}
              <div
                style={{
                  flex: 1,
                  padding: "15px 20px",
                  borderRight: "2px solid #000",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "42px",
                    fontWeight: "bold",
                    lineHeight: "1",
                    marginBottom: "3px",
                    letterSpacing: "3px",
                  }}
                >
                  {budgetData.companyName}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {budgetData.companySubtitle}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    lineHeight: "1.4",
                  }}
                >
                  <div style={{ fontStyle: "italic", marginBottom: "4px" }}>
                    Fabricação própria e reformas em geral
                  </div>
                  <div style={{ whiteSpace: "pre-line", marginBottom: "3px" }}>
                    {budgetData.companyAddress}
                  </div>
                  <div style={{ marginBottom: "2px" }}>
                    {budgetData.companyEmail}
                  </div>
                  <div style={{ marginBottom: "2px" }}>
                    <strong>CNPJ:</strong> {budgetData.companyCNPJ}
                  </div>
                  <div>
                    <strong>Tel.: {budgetData.companyPhone}</strong>
                  </div>
                </div>
              </div>

              {/* Right side - Budget Info */}
              <div
                style={{
                  width: "180px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "16px",
                    borderBottom: "2px solid #000",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ORÇAMENTO
                </div>
                <div
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    fontSize: "11px",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "2px solid #000",
                  }}
                >
                  <div>
                    <strong>Data:</strong> {budgetData.date}
                  </div>
                </div>
                <div
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    fontSize: "11px",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div>
                    <strong>Nº:</strong> {budgetData.budgetNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "15px", fontSize: "12px" }}>
              {/* Client Info */}
              <div style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #000",
                    padding: "5px 0",
                  }}
                >
                  <span>Cliente: </span>
                  <span
                    style={{
                      flex: 1,
                      textDecoration: "underline",
                      marginLeft: "5px",
                    }}
                  >
                    {budgetData.client}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #000",
                    padding: "5px 0",
                  }}
                >
                  <span>Rua: </span>
                  <span
                    style={{
                      flex: 1,
                      textDecoration: "underline",
                      marginLeft: "5px",
                    }}
                  >
                    {budgetData.street}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <div style={{ borderBottom: "1px solid #000", padding: "5px 0" }}>
                  Cidade: <u>{budgetData.city}</u>
                </div>
                <div style={{ borderBottom: "1px solid #000", padding: "5px 0" }}>
                  Cep: <u>{budgetData.cep}</u>
                </div>
                <div style={{ borderBottom: "1px solid #000", padding: "5px 0" }}>
                  UF:<u>{budgetData.uf}</u>
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #000",
                    padding: "5px 0",
                  }}
                >
                  <span>Tel.: </span>
                  <span style={{ textDecoration: "underline", marginRight: "20px" }}>
                    {budgetData.phone}
                  </span>
                  <span style={{ marginLeft: "auto" }}>Cond. Pgto:</span>
                  <span
                    style={{
                      textDecoration: "underline",
                      marginLeft: "5px",
                    }}
                  >
                    {budgetData.paymentCondition}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "15px",
                }}
              >
                <div>
                  Entrada: <u>{budgetData.downPayment}</u>
                </div>
                <div>
                  Prev. Entrega: <u>{budgetData.deliveryTime}</u>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #000", padding: "8px" }}>
                      Qtd.
                    </th>
                    <th style={{ border: "1px solid #000", padding: "8px" }}>
                      Unid.
                    </th>
                    <th style={{ border: "1px solid #000", padding: "8px" }}>
                      Descrição
                    </th>
                    <th style={{ border: "1px solid #000", padding: "8px" }}>
                      V. Unid.
                    </th>
                    <th style={{ border: "1px solid #000", padding: "8px" }}>
                      Valor Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {budgetData.items.map((item) => (
                    <tr key={item.id}>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {item.unit}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "8px" }}>
                        {item.description}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "right",
                        }}
                      >
                        R$ {item.unitPrice.toFixed(2).replace(".", ",")}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "right",
                        }}
                      >
                        R$ {item.total.toFixed(2).replace(".", ",")}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Empty rows */}
                  {emptyRows.map((i) => (
                    <tr key={`empty-${i}`}>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          height: "30px",
                        }}
                      ></td>
                      <td style={{ border: "1px solid #000", padding: "8px" }}></td>
                      <td style={{ border: "1px solid #000", padding: "8px" }}></td>
                      <td style={{ border: "1px solid #000", padding: "8px" }}></td>
                      <td style={{ border: "1px solid #000", padding: "8px" }}></td>
                    </tr>
                  ))}

                  {/* Validity row */}
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      ORÇAMENTO VÁLIDO POR 30 DIAS
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      Total Geral:
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      R$ {total.toFixed(2).replace(".", ",")}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Signature */}
              <div
                style={{
                  marginTop: "40px",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    borderTop: "1px solid #000",
                    paddingTop: "5px",
                    minWidth: "300px",
                  }}
                >
                  Assinatura
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}