from channels.generic.websocket import AsyncJsonWebsocketConsumer


class SyncListenConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive_json(self, content):
        self.token = content["token"]
        await self.channel_layer.group_add(self.token, self.channel_name)

    async def sync_event(self, event):
        await self.send_json(content=event["content"])


class SyncTellConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    # on listening connection open
    async def receive_json(self, content):
        self.token = content["token"]

        await self.channel_layer.group_send(self.token, {
            "type": "sync.event",
            "content": content,
            })
        await self.send_json(content=content)

    async def sync_event(self):
        pass
