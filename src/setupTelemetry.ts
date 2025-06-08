import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

export async function setupTelemetry() {
    // Create a trace exporter
    const traceExporter = new OTLPTraceExporter({
        url: "http://localhost:4318/v1/traces", // OTLP endpoint for Collector
    });

    const resource = await resourceFromAttributes({
        [SemanticResourceAttributes.SERVICE_NAME]: 'sokoide-shopping',
    });

    // traces
    const traceProvider = new WebTracerProvider({
        resource,
    });
    traceProvider.register();

    // logs
    const logExporter = new OTLPLogExporter({
        url: 'http://localhost:4318/v1/logs',
        headers: {}, // don't send credentials
    });

    const loggerProvider = new LoggerProvider({ resource });
    loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter));
    const logger = loggerProvider.getLogger('sokoide-logger');


    const originalConsoleLog = console.log;      // 保存しておく
    const originalConsoleWarn = console.warn;    // 保存しておく
    const originalConsoleError = console.error;  // 保存しておく

    const sendLogToOTLP = (severity: string, ...args: any[]) => {
        const logMessage = args
            .map(arg => (typeof arg === "object" ? JSON.stringify(arg) : arg))
            .join(" ");

        // Export the log message to OTLP
        try {
            logger.emit({
                body: logMessage,
                severityText: severity,
            });
            originalConsoleLog("logger.emit %o", logMessage);

            // traceExporter.export(
            //     [
            //         {
            //             body: logMessage,
            //             attributes: {
            //                 "service.name": "sokoide-shopping",
            //                 "severity.text": severity,
            //             },
            //         },
            //     ],
            //     {
            //         onSuccess: () => {
            //             originalConsoleLog("Log successfully sent to OTLP."); // Use the original console log
            //         },
            //         onError: error => {
            //             originalConsoleLog("Failed to send log to OTLP:", error); // Use the original console log
            //         },
            //     }
            // );
        } catch (e) {
            originalConsoleError("Error exporting log:", e); // Use the original console error
        }
    };

    // Override console methods
    console.log = (...args: any[]) => {
        sendLogToOTLP("INFO", ...args);
        originalConsoleLog(...args); // Use the original console log
    };
    console.warn = (...args: any[]) => {
        sendLogToOTLP("WARN", ...args);
        originalConsoleWarn(...args); // Use the original console warn
    };
    console.error = (...args: any[]) => {
        sendLogToOTLP("ERROR", ...args);
        originalConsoleError(...args); // Use the original console error
    };

    originalConsoleLog("Telemetry setup has been completed.");
}
