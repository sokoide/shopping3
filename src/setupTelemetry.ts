import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

export async function setupTelemetry() {
    // Create a trace exporter
    const traceExporter = new OTLPTraceExporter({
        url: "http://localhost:4318/v1/traces", // OTLP endpoint for Collector
    });

    const resource = await resourceFromAttributes({
        [SemanticResourceAttributes.SERVICE_NAME]: 'sokoide-shopping',
    });

    const provider = new WebTracerProvider({
        resource,
    });

    const logExporter = new OTLPLogExporter({
        url: 'http://localhost:4318/v1/logs',
    });

    // provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
    provider.register();

    const sendLogToOTLP = (severity: string, ...args: any[]) => {
        const originalConsoleMethod =
            severity === 'INFO' ? console.log : severity === 'WARN' ? console.warn : console.error;

        originalConsoleMethod.apply(console, args);

        const logMessage = args
            .map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
            .join(' ');
        logExporter.export(
            [
                {
                    body: logMessage,
                    attributes: {
                        'service.name': 'sokoide-shopping',
                        'severity.text': severity,
                    },
                },
            ],
            {
                onSuccess: () => {
                    originalConsoleMethod('Log successfully sent to OTLP.');
                },
                onError: error => {
                    originalConsoleMethod('Failed to send log to OTLP:', error);
                },
            }
        );
    };

    console.log = (...args: any[]) => sendLogToOTLP('INFO', ...args);
    console.warn = (...args: any[]) => sendLogToOTLP('WARN', ...args);
    console.error = (...args: any[]) => sendLogToOTLP('ERROR', ...args);
}
