from io import StringIO
import os 
import sys


class Capturing():
    def __init__(self, path=None):
        self.path = path
        if (self.path is not None):
            try:
                os.makedirs(os.path.dirname(self.path))
            except:
                print("Overwriting log file")

    def __enter__(self):
        self.log = "Not started yet"
        self._stdout = sys.stdout
        sys.stdout = self

        if self.path is not None:
            self._logfile = open(self.path, "w+")

        return self

    def write(self, data):
        if self.path is not None:
            self._logfile.write(data)
            self._logfile.flush()  

        self._stdout.write(data)
        self.log += data

    def flush(self):
        pass

    def get_text(self):
        return self.log

    def __exit__(self, *args):
        self._logfile.close()
        del self._logfile
        sys.stdout = self._stdout