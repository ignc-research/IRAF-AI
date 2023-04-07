from threading import Lock
from subprocess import PIPE, Popen
from threading import Thread
from reactivex.subject import BehaviorSubject
from typing import Callable
import sys
import uuid
import os

ON_POSIX = 'posix' in sys.builtin_module_names

WORKING_DIR = "./ir_drl"

class Process:
    id: uuid.UUID

    # Either eval or train
    type: str
    config_name: str
    log: str = ''
    logline_sub = BehaviorSubject('Not started yet\r\n')

    on_done: Callable

    def __init__(self, config_name, type: str, on_done: Callable) -> None:
        self.id = uuid.uuid4()
        self.config_name = config_name
        self.type = type
        self.on_done = on_done

    def enqueue_output(self, out):
        for line in iter(out.readline, b''):
            utfLine = line.decode("utf-8")
            self.log += utfLine
            self.logline_sub.on_next(utfLine)

        out.close()
        self.logline_sub.on_next(None)
        self.on_done(self)

    def spawn_process(self):
        p = Popen(['python', './run.py', f'--{self.type}', self.config_name], stdout=PIPE,
                  bufsize=1, close_fds=ON_POSIX, cwd=WORKING_DIR)
        t = Thread(target=self.enqueue_output, args=(p.stdout,))
        t.daemon = True  # thread dies with the program
        t.start()

class ProcessManager:
    processes: list[Process] = []

    plist_lock = Lock()

    def process_done(self, p: Process):
        self.plist_lock.acquire()
        self.processes.remove(p)
        print("Removed process from task list")
        self.plist_lock.release()

    def spawn_process(self, config_name: str, type: str):
        self.plist_lock.acquire()
        p = Process(config_name, type, self.process_done)
        self.processes.append(p)
        self.plist_lock.release()
        p.spawn_process()
        return str(p.id)
    
    def get_process(self, id):
        return next(x for x in self.processes if str(x.id) == id)

    def get_process_list(self):
        return list(map(lambda p: {
            "id": str(p.id),
            "type": p.type,
            "config": p.config_name
        }, self.processes))

