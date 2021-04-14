import asyncio, aiohttp, sys
from aiohttp import web

# Краснознаменный ордена Ленина сервер обработки кода имени М.В.Капленко
# v.0.6.2 - Работает на исполнение кода, инпуты поддерживаются (пока топорно), выводит ошибки
# Пофикшен хеадер (вроде)


async def run(request):
    response = {}
    post_data = await request.post()
    print(dict(post_data))
    code = post_data['code']
    process = await asyncio.create_subprocess_exec(sys.executable, '-c', code, stdin=asyncio.subprocess.PIPE,
                                                stderr=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE)
    output, traceback = await process.communicate(input=None)
    data_output = output.decode('ascii').rstrip()
    data_traceback = traceback.decode('ascii').rstrip()
    response['output'] = data_output
    response['traceback'] = data_traceback
    print(response)
    return web.json_response(response, headers={'Access-Control-Allow-Origin': '*'})

app = aiohttp.web.Application()
app.router.add_post('/', run)
web.run_app(app)

'''
to do:
async input
python subprocess interact with user
'''
