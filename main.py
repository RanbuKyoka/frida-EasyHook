import frida, sys
def on_message(message, data):
    if message['type'] == 'send':
        strs = "{0}".format(message['payload'])
        print(strs.replace('\\','').replace('"',''))

    else:
        print(message)
if __name__ == '__main__':
    jscode = """
    """
    with open('JsCodeFile/WhatsApp/Method/test.js', 'r+')as file:
        jscode = file.read()
    jscode = jscode.replace('packclass','java.io.FileInputStream')
    process = frida.get_usb_device().attach('com.whatsapp')
    script = process.create_script(jscode)
    script.on('message', on_message)
    print('[*] Running CTF')
    script.load()
    sys.stdin.read()