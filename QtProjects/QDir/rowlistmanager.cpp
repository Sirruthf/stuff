#include "rowlistmanager.h"


void RowListManager::push (RowWidget* _new)
{
    list.push_back(_new);
}

void RowListManager::hideNonConf()
{
    for (auto& i : list)
        if (!i->hasConflict)
            i->hide();
    hidden = true;
}

void RowListManager::showNonConf()
{
    for (auto& i : list)
        if (!i->hasConflict)
            i->show();
    hidden = false;
}

void RowListManager::conflictClickSlot ()
{
    if ( hidden) showNonConf(); else
    if (!hidden) hideNonConf();
}

void RowListManager::clear()
{
    qDeleteAll(list);
    list.clear();
}
