#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QDirIterator>
#include <QVBoxLayout>
#include <QScrollBar>
#include "fsparams.h"
#include "rowlistmanager.h"
#include "headerwidget.h"
#include "filetree.h"
#include "ftiterator.h"

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE


//typedef QMap<QString, bool> FileTree;
typedef QMap<QString, FileTree*> FileTreeList;

class MainWindow: public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private:
    QString defaultIni = "settings.ini";
    QVBoxLayout* content;
    RowListManager* manager;
    HeaderWidget* titleRow;
    FSParams* params;
    FileTreeList* files;

    Ui::MainWindow *ui;

    void start();
    FileTreeList* getFileLists (FSParams*);
    void setupPalette (FSParams*);
    void printRows (FileTreeList*, FSParams*);

    void resizeEvent (QResizeEvent*);
    void resizeHeader();

public slots:
    void headerOrderChanged();

};
#endif // MAINWINDOW_H
