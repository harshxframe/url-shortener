export function responseBody(error, code, message, data){
    return {
        error:error || true,
        code:code || 500,
        message:message || "Server Error",
        data:data || {},
        timeStamp:new Date().toISOString()
    }
}